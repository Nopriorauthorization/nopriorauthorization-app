import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

interface AppointmentWithProvider {
  id: string;
  providerName: string;
  providerSpecialty: string | null;
  appointmentDate: Date;
  appointmentType: string;
  status: string;
  location: string | null;
  notes: string | null;
}

interface GroupedAppointments {
  upcoming: AppointmentWithProvider[];
  past: AppointmentWithProvider[];
  byProvider: Record<string, {
    appointments: AppointmentWithProvider[];
    count: number;
    lastVisit: Date | null;
    nextVisit: Date | null;
  }>;
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const anonId = cookieStore.get("anon_id")?.value || cookieStore.get("npa_uid")?.value;

    if (!anonId) {
      return NextResponse.json(
        { error: "No user identified" },
        { status: 401 }
      );
    }

    // Get user memory to find linked user
    const userMemory = await prisma.userMemory.findFirst({
      where: { anonId }
    });

    if (!userMemory) {
      return NextResponse.json({
        upcoming: [],
        past: [],
        byProvider: {}
      });
    }

    // Fetch appointments (by userId if linked, otherwise by anonId)
    const appointments = await prisma.appointment.findMany({
      where: userMemory.userId
        ? { userId: userMemory.userId }
        : { anonId },
      orderBy: {
        appointmentDate: "desc"
      }
    });

    const now = new Date();
    const upcoming: AppointmentWithProvider[] = [];
    const past: AppointmentWithProvider[] = [];
    const byProvider: Record<string, {
      appointments: AppointmentWithProvider[];
      count: number;
      lastVisit: Date | null;
      nextVisit: Date | null;
    }> = {};

    appointments.forEach((apt) => {
      const appointment: AppointmentWithProvider = {
        id: apt.id,
        providerName: apt.providerName,
        providerSpecialty: apt.providerSpecialty,
        appointmentDate: apt.appointmentDate,
        appointmentType: apt.appointmentType,
        status: apt.status,
        location: apt.location,
        notes: apt.notes
      };

      // Categorize by time
      if (apt.appointmentDate >= now && apt.status === "scheduled") {
        upcoming.push(appointment);
      } else {
        past.push(appointment);
      }

      // Group by provider
      if (!byProvider[apt.providerName]) {
        byProvider[apt.providerName] = {
          appointments: [],
          count: 0,
          lastVisit: null,
          nextVisit: null
        };
      }

      byProvider[apt.providerName].appointments.push(appointment);
      byProvider[apt.providerName].count++;

      // Update last and next visit dates
      if (apt.appointmentDate < now) {
        if (!byProvider[apt.providerName].lastVisit || 
            apt.appointmentDate > byProvider[apt.providerName].lastVisit!) {
          byProvider[apt.providerName].lastVisit = apt.appointmentDate;
        }
      } else if (apt.status === "scheduled") {
        if (!byProvider[apt.providerName].nextVisit || 
            apt.appointmentDate < byProvider[apt.providerName].nextVisit!) {
          byProvider[apt.providerName].nextVisit = apt.appointmentDate;
        }
      }
    });

    // Sort upcoming by soonest first
    upcoming.sort((a, b) => a.appointmentDate.getTime() - b.appointmentDate.getTime());

    const response: GroupedAppointments = {
      upcoming,
      past,
      byProvider
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}
