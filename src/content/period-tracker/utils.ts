import { HIPAAConsent, CycleEntry, AuditEntry, ValidationResult } from './types';

// HIPAA Compliance Utilities
export class HIPAACompliance {
  private static readonly ENCRYPTION_KEY = process.env.NEXT_PUBLIC_HIPAA_ENCRYPTION_KEY || 'default-dev-key';
  private static readonly RETENTION_PERIOD_DAYS = 2555; // 7 years

  // Encrypt sensitive health data
  static async encryptData(data: any): Promise<string> {
    try {
      const jsonString = JSON.stringify(data);
      // In production, use proper encryption like AES-256-GCM
      // For demo purposes, using base64 encoding
      return btoa(jsonString);
    } catch (error) {
      throw new Error('Failed to encrypt data');
    }
  }

  // Decrypt sensitive health data
  static async decryptData(encryptedData: string): Promise<any> {
    try {
      const jsonString = atob(encryptedData);
      return JSON.parse(jsonString);
    } catch (error) {
      throw new Error('Failed to decrypt data');
    }
  }

  // Validate HIPAA consent
  static validateConsent(consent: HIPAAConsent): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!consent.consentGiven) {
      errors.push('HIPAA consent must be granted to process health data');
    }

    if (!consent.purpose) {
      errors.push('Purpose of data usage must be specified');
    }

    if (consent.retentionPeriod > this.RETENTION_PERIOD_DAYS) {
      warnings.push(`Retention period exceeds recommended ${this.RETENTION_PERIOD_DAYS} days`);
    }

    const validScopes = ['none', 'analytics', 'providers', 'research'];
    if (!validScopes.includes(consent.dataSharingScope)) {
      errors.push('Invalid data sharing scope');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // Create audit log entry
  static createAuditEntry(
    action: AuditEntry['action'],
    userId: string,
    resourceType: string,
    resourceId: string,
    ipAddress?: string,
    userAgent?: string
  ): AuditEntry {
    return {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      action,
      userId,
      resourceType,
      resourceId,
      ipAddress,
      userAgent
    };
  }

  // Check data retention compliance
  static isDataRetentionCompliant(dataDate: Date): boolean {
    const retentionCutoff = new Date();
    retentionCutoff.setDate(retentionCutoff.getDate() - this.RETENTION_PERIOD_DAYS);
    return dataDate >= retentionCutoff;
  }

  // Generate data usage report for user
  static generateDataUsageReport(userId: string, auditLogs: AuditEntry[]): any {
    const userLogs = auditLogs.filter(log => log.userId === userId);

    return {
      userId,
      totalAccesses: userLogs.length,
      accessesByType: userLogs.reduce((acc, log) => {
        acc[log.action] = (acc[log.action] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      lastAccess: userLogs.length > 0 ? Math.max(...userLogs.map(log => log.timestamp.getTime())) : null,
      dataTypesAccessed: [...new Set(userLogs.map(log => log.resourceType))]
    };
  }
}

// Cycle Analysis Utilities
export class CycleAnalytics {
  // Calculate average cycle length
  static calculateAverageCycleLength(cycles: CycleEntry[]): number {
    if (cycles.length < 2) return 28; // Default assumption

    const sortedCycles = cycles.sort((a, b) => a.date.getTime() - b.date.getTime());
    const lengths: number[] = [];

    for (let i = 1; i < sortedCycles.length; i++) {
      const diff = sortedCycles[i].date.getTime() - sortedCycles[i-1].date.getTime();
      lengths.push(Math.round(diff / (1000 * 60 * 60 * 24)));
    }

    return Math.round(lengths.reduce((sum, len) => sum + len, 0) / lengths.length);
  }

  // Calculate cycle regularity (0-100)
  static calculateCycleRegularity(cycles: CycleEntry[]): number {
    if (cycles.length < 3) return 0;

    const lengths = this.getCycleLengths(cycles);
    const average = lengths.reduce((sum, len) => sum + len, 0) / lengths.length;
    const variance = lengths.reduce((sum, len) => sum + Math.pow(len - average, 2), 0) / lengths.length;
    const standardDeviation = Math.sqrt(variance);

    // Convert to regularity score (lower deviation = higher regularity)
    const regularity = Math.max(0, 100 - (standardDeviation / average) * 100);
    return Math.round(regularity);
  }

  // Get cycle lengths array
  private static getCycleLengths(cycles: CycleEntry[]): number[] {
    const sortedCycles = cycles.sort((a, b) => a.date.getTime() - b.date.getTime());
    const lengths: number[] = [];

    for (let i = 1; i < sortedCycles.length; i++) {
      const diff = sortedCycles[i].date.getTime() - sortedCycles[i-1].date.getTime();
      lengths.push(Math.round(diff / (1000 * 60 * 60 * 24)));
    }

    return lengths;
  }

  // Predict next period
  static predictNextPeriod(cycles: CycleEntry[]): Date | null {
    if (cycles.length < 2) return null;

    const averageLength = this.calculateAverageCycleLength(cycles);
    const lastCycle = cycles.sort((a, b) => b.date.getTime() - a.date.getTime())[0];

    const nextPeriod = new Date(lastCycle.date);
    nextPeriod.setDate(nextPeriod.getDate() + averageLength);

    return nextPeriod;
  }

  // Predict ovulation date
  static predictOvulationDate(cycles: CycleEntry[]): Date | null {
    const nextPeriod = this.predictNextPeriod(cycles);
    if (!nextPeriod) return null;

    // Typical ovulation occurs 14 days before next period
    const ovulationDate = new Date(nextPeriod);
    ovulationDate.setDate(ovulationDate.getDate() - 14);

    return ovulationDate;
  }

  // Get fertile window
  static getFertileWindow(cycles: CycleEntry[]): { start: Date; end: Date } | null {
    const ovulationDate = this.predictOvulationDate(cycles);
    if (!ovulationDate) return null;

    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(fertileStart.getDate() - 5); // 5 days before ovulation

    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(fertileEnd.getDate() + 1); // 1 day after ovulation

    return { start: fertileStart, end: fertileEnd };
  }
}

// Data Validation Utilities
export class DataValidator {
  // Validate cycle entry data
  static validateCycleEntry(entry: Partial<CycleEntry>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!entry.date) {
      errors.push('Date is required');
    }

    if (!entry.flowLevel || entry.flowLevel < 1 || entry.flowLevel > 5) {
      errors.push('Flow level must be between 1 and 5');
    }

    if (entry.mood && (entry.mood < 1 || entry.mood > 10)) {
      errors.push('Mood must be between 1 and 10');
    }

    if (entry.energy && (entry.energy < 1 || entry.energy > 10)) {
      errors.push('Energy must be between 1 and 10');
    }

    if (entry.temperature && (entry.temperature < 35 || entry.temperature > 42)) {
      warnings.push('Temperature seems outside normal range (35-42°C)');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // Validate symptom data
  static validateSymptom(symptom: Partial<Symptom>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!symptom.name || symptom.name.trim().length === 0) {
      errors.push('Symptom name is required');
    }

    if (!symptom.severity || symptom.severity < 1 || symptom.severity > 5) {
      errors.push('Symptom severity must be between 1 and 5');
    }

    const validCategories = ['physical', 'emotional', 'other'];
    if (!symptom.category || !validCategories.includes(symptom.category)) {
      errors.push('Invalid symptom category');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}

// Date Utilities
export class DateUtils {
  // Get cycle phase
  static getCyclePhase(cycleStart: Date, currentDate: Date): 'menstrual' | 'follicular' | 'ovulation' | 'luteal' {
    const daysDiff = Math.floor((currentDate.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff <= 5) return 'menstrual';
    if (daysDiff <= 13) return 'follicular';
    if (daysDiff <= 15) return 'ovulation';
    return 'luteal';
  }

  // Get cycle day number
  static getCycleDay(cycleStart: Date, currentDate: Date): number {
    return Math.floor((currentDate.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }

  // Format date for display
  static formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }

  // Format date range
  static formatDateRange(start: Date, end: Date): string {
    return `${this.formatDate(start)} - ${this.formatDate(end)}`;
  }
}