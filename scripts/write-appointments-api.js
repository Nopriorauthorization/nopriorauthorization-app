const fs = require('fs');
const path = require('path');

const appointmentsApiContent = `import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { resolveDocumentIdentity } from "@/lib/documents/server";

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

export async function GET(req: NextRequest) {
  try {
    const identity = await resolveDocumentIdentity(req);
    if (!identity.userId && !identity.anonId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const where = identity.userId ? { userId: identity.userId } : { anonId: identity.anonId };

    const appointments = await prisma.appointment.findMany({
      where,
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

      if (apt.appointmentDate >= now && apt.status === "scheduled") {
        upcoming.push(appointment);
      } else {
        past.push(appointment);
      }

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

    upcoming.sort((a, b) => a.appointmentDate.getTime() - b.appointmentDate.getTime());

    const response: GroupedAppointments = {
      upcoming,
      past,
      byProvider
    };

    const isEmpty = appointments.length === 0;

    return NextResponse.json({ ...response, isEmpty });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const identity = await resolveDocumentIdentity(req);
    if (!identity.userId && !identity.anonId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { providerName, providerSpecialty, appointmentDate, appointmentType, status, location, notes } = body;

    if (!providerName || !appointmentDate || !appointmentType) {
      return NextResponse.json(
        { error: "Provider name, date, and type are required" },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId: identity.userId || undefined,
        anonId: identity.anonId || undefined,
        providerName,
        providerSpecialty: providerSpecialty || null,
        appointmentDate: new Date(appointmentDate),
        appointmentType,
        status: status || "scheduled",
        location: location || null,
        notes: notes || null,
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}
`;

const targetPath = path.join(process.cwd(), 'src/app/api/vault/appointments/route.ts');
fs.writeFileSync(targetPath, appointmentsApiContent, 'utf8');
console.log('✅ Appointments API successfully written to:', targetPath);
