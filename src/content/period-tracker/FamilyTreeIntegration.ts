import { GeneticInsight, CycleEntry, TreatmentCorrelation } from './types';
import { AIPredictionEngine } from './AIPredictionEngine';

// Family Tree Genetics Integration
export class FamilyTreeIntegration {
  // Connect menstrual cycle data with genetic insights
  static async correlateGeneticsWithCycles(
    cycles: CycleEntry[],
    geneticData: any // Would come from Family Tree API
  ): Promise<GeneticInsight[]> {
    const insights: GeneticInsight[] = [];

    // PCOS and hormonal disorder correlations
    const pcosCorrelation = await this.analyzePCOSRisk(cycles, geneticData);
    if (pcosCorrelation) insights.push(pcosCorrelation);

    // Endometriosis risk assessment
    const endoCorrelation = await this.analyzeEndometriosisRisk(cycles, geneticData);
    if (endoCorrelation) insights.push(endoCorrelation);

    // Thyroid condition correlations
    const thyroidCorrelation = await this.analyzeThyroidRisk(cycles, geneticData);
    if (thyroidCorrelation) insights.push(thyroidCorrelation);

    // Fertility genetic factors
    const fertilityCorrelation = await this.analyzeFertilityGenetics(cycles, geneticData);
    if (fertilityCorrelation) insights.push(fertilityCorrelation);

    // Treatment response predictions
    const treatmentCorrelations = await this.analyzeTreatmentResponseGenetics(cycles, geneticData);
    insights.push(...treatmentCorrelations);

    return insights;
  }

  // Analyze PCOS risk based on genetics and cycle patterns
  private static async analyzePCOSRisk(
    cycles: CycleEntry[],
    geneticData: any
  ): Promise<GeneticInsight | null> {
    // Check for PCOS-associated genetic markers
    const pcosMarkers = geneticData?.markers?.filter((m: any) =>
      m.condition === 'PCOS' || m.trait?.toLowerCase().includes('polycystic')
    );

    if (!pcosMarkers || pcosMarkers.length === 0) return null;

    // Analyze cycle patterns for PCOS indicators
    const irregularity = this.calculateCycleIrregularity(cycles);
    const longCycles = cycles.filter(c => {
      // Calculate cycle length (simplified)
      return true; // Would calculate actual cycle lengths
    }).length;

    let riskLevel: 'low' | 'moderate' | 'high' = 'low';
    let confidence = 0;

    // Genetic risk assessment
    if (pcosMarkers.some((m: any) => m.risk === 'high')) {
      riskLevel = 'high';
      confidence += 40;
    } else if (pcosMarkers.some((m: any) => m.risk === 'moderate')) {
      riskLevel = 'moderate';
      confidence += 20;
    }

    // Cycle pattern risk assessment
    if (irregularity > 70) confidence += 30;
    if (longCycles > cycles.length * 0.3) confidence += 20;

    if (confidence < 30) return null;

    return {
      id: crypto.randomUUID(),
      userId: cycles[0]?.userId || '',
      trait: 'PCOS Risk',
      riskLevel,
      recommendation: this.generatePCOSRecommendations(riskLevel),
      source: 'genetic_markers',
      confidence: Math.min(100, confidence),
      relatedConditions: ['Irregular cycles', 'Hormonal imbalance', 'Fertility concerns'],
      createdAt: new Date()
    };
  }

  // Analyze endometriosis risk
  private static async analyzeEndometriosisRisk(
    cycles: CycleEntry[],
    geneticData: any
  ): Promise<GeneticInsight | null> {
    const endoMarkers = geneticData?.markers?.filter((m: any) =>
      m.condition?.toLowerCase().includes('endometriosis') ||
      m.trait?.toLowerCase().includes('pelvic')
    );

    if (!endoMarkers || endoMarkers.length === 0) return null;

    // Look for endometriosis indicators in cycle data
    const severePainSymptoms = cycles.flatMap(c => c.symptoms)
      .filter(s => s.name.toLowerCase().includes('pain') && s.severity >= 4);

    const heavyBleeding = cycles.filter(c => c.flowLevel >= 4);

    let riskLevel: 'low' | 'moderate' | 'high' = 'low';
    let confidence = 0;

    if (endoMarkers.some((m: any) => m.risk === 'high')) {
      riskLevel = 'high';
      confidence += 35;
    }

    if (severePainSymptoms.length > cycles.length * 0.4) confidence += 25;
    if (heavyBleeding.length > cycles.length * 0.3) confidence += 20;

    if (confidence < 40) return null;

    return {
      id: crypto.randomUUID(),
      userId: cycles[0]?.userId || '',
      trait: 'Endometriosis Risk',
      riskLevel,
      recommendation: 'Consider pelvic ultrasound if experiencing severe menstrual pain. Genetic factors suggest increased monitoring may be beneficial.',
      source: 'genetic_markers',
      confidence: Math.min(100, confidence),
      relatedConditions: ['Severe menstrual pain', 'Heavy bleeding', 'Pelvic inflammatory conditions'],
      createdAt: new Date()
    };
  }

  // Analyze thyroid condition correlations
  private static async analyzeThyroidRisk(
    cycles: CycleEntry[],
    geneticData: any
  ): Promise<GeneticInsight | null> {
    const thyroidMarkers = geneticData?.markers?.filter((m: any) =>
      m.condition?.toLowerCase().includes('thyroid') ||
      m.trait?.toLowerCase().includes('autoimmune')
    );

    if (!thyroidMarkers || thyroidMarkers.length === 0) return null;

    // Thyroid issues often manifest as cycle irregularities
    const irregularity = this.calculateCycleIrregularity(cycles);

    let riskLevel: 'low' | 'moderate' | 'high' = 'low';
    let confidence = 0;

    if (thyroidMarkers.some((m: any) => m.risk === 'high')) {
      riskLevel = 'high';
      confidence += 40;
    } else if (thyroidMarkers.some((m: any) => m.risk === 'moderate')) {
      riskLevel = 'moderate';
      confidence += 25;
    }

    if (irregularity > 60) confidence += 20;

    if (confidence < 35) return null;

    return {
      id: crypto.randomUUID(),
      userId: cycles[0]?.userId || '',
      trait: 'Thyroid Function',
      riskLevel,
      recommendation: 'Monitor thyroid function annually. Genetic predisposition suggests regular TSH testing may be beneficial.',
      source: 'genetic_markers',
      confidence: Math.min(100, confidence),
      relatedConditions: ['Cycle irregularities', 'Fatigue', 'Weight changes', 'Autoimmune conditions'],
      createdAt: new Date()
    };
  }

  // Analyze fertility-related genetics
  private static async analyzeFertilityGenetics(
    cycles: CycleEntry[],
    geneticData: any
  ): Promise<GeneticInsight | null> {
    const fertilityMarkers = geneticData?.markers?.filter((m: any) =>
      m.condition?.toLowerCase().includes('fertility') ||
      m.trait?.toLowerCase().includes('reproductive')
    );

    if (!fertilityMarkers || fertilityMarkers.length === 0) return null;

    // Analyze fertility indicators from cycle data
    const regularCycles = this.calculateCycleRegularity(cycles);
    const averageCycleLength = this.calculateAverageCycleLength(cycles);

    let riskLevel: 'low' | 'moderate' | 'high' = 'low';
    let confidence = 0;

    if (fertilityMarkers.some((m: any) => m.risk === 'high')) {
      riskLevel = 'high';
      confidence += 30;
    }

    if (regularCycles < 70) confidence += 25; // Irregular cycles can affect fertility
    if (averageCycleLength < 25 || averageCycleLength > 35) confidence += 20;

    if (confidence < 30) return null;

    return {
      id: crypto.randomUUID(),
      userId: cycles[0]?.userId || '',
      trait: 'Fertility Factors',
      riskLevel,
      recommendation: 'Consider fertility consultation if planning pregnancy. Genetic analysis suggests personalized fertility optimization may be beneficial.',
      source: 'genetic_markers',
      confidence: Math.min(100, confidence),
      relatedConditions: ['Fertility optimization', 'Cycle regulation', 'Hormonal balance'],
      createdAt: new Date()
    };
  }

  // Analyze treatment response based on genetics
  private static async analyzeTreatmentResponseGenetics(
    cycles: CycleEntry[],
    geneticData: any
  ): Promise<GeneticInsight[]> {
    const insights: GeneticInsight[] = [];

    // Analyze response to hormonal treatments
    const hormonalResponse = await this.analyzeHormonalTreatmentResponse(cycles, geneticData);
    if (hormonalResponse) insights.push(hormonalResponse);

    // Analyze response to anti-inflammatory treatments
    const antiInflammatoryResponse = await this.analyzeAntiInflammatoryResponse(cycles, geneticData);
    if (antiInflammatoryResponse) insights.push(antiInflammatoryResponse);

    return insights;
  }

  // Analyze hormonal treatment response genetics
  private static async analyzeHormonalTreatmentResponse(
    cycles: CycleEntry[],
    geneticData: any
  ): Promise<GeneticInsight | null> {
    const hormonalMarkers = geneticData?.markers?.filter((m: any) =>
      m.trait?.toLowerCase().includes('hormone') ||
      m.condition?.toLowerCase().includes('estrogen') ||
      m.condition?.toLowerCase().includes('progesterone')
    );

    if (!hormonalMarkers || hormonalMarkers.length === 0) return null;

    return {
      id: crypto.randomUUID(),
      userId: cycles[0]?.userId || '',
      trait: 'Hormonal Treatment Response',
      riskLevel: hormonalMarkers.some((m: any) => m.risk === 'high') ? 'moderate' : 'low',
      recommendation: 'Genetic profile suggests monitoring hormone levels during treatment. Consider personalized dosing based on genetic markers.',
      source: 'genetic_markers',
      confidence: 75,
      relatedConditions: ['Hormonal treatments', 'Botox efficacy', 'Filler response'],
      createdAt: new Date()
    };
  }

  // Analyze anti-inflammatory treatment response
  private static async analyzeAntiInflammatoryResponse(
    cycles: CycleEntry[],
    geneticData: any
  ): Promise<GeneticInsight | null> {
    const inflammationMarkers = geneticData?.markers?.filter((m: any) =>
      m.trait?.toLowerCase().includes('inflammation') ||
      m.condition?.toLowerCase().includes('inflammatory')
    );

    if (!inflammationMarkers || inflammationMarkers.length === 0) return null;

    return {
      id: crypto.randomUUID(),
      userId: cycles[0]?.userId || '',
      trait: 'Anti-inflammatory Response',
      riskLevel: inflammationMarkers.some((m: any) => m.risk === 'high') ? 'moderate' : 'low',
      recommendation: 'Genetic factors suggest anti-inflammatory treatments may be more effective. Consider COX-2 genotyping for optimal treatment selection.',
      source: 'genetic_markers',
      confidence: 70,
      relatedConditions: ['Pain management', 'Anti-inflammatory treatments', 'Treatment efficacy'],
      createdAt: new Date()
    };
  }

  // Utility functions for cycle analysis
  private static calculateCycleIrregularity(cycles: CycleEntry[]): number {
    if (cycles.length < 3) return 100;

    // Simplified irregularity calculation
    const lengths = cycles.slice(1).map((cycle, index) => {
      const prevCycle = cycles[index];
      return Math.abs(cycle.date.getTime() - prevCycle.date.getTime()) / (24 * 60 * 60 * 1000);
    });

    const average = lengths.reduce((sum, len) => sum + len, 0) / lengths.length;
    const variance = lengths.reduce((sum, len) => sum + Math.pow(len - average, 2), 0) / lengths.length;
    const irregularity = Math.sqrt(variance) / average * 100;

    return Math.min(100, irregularity);
  }

  private static calculateCycleRegularity(cycles: CycleEntry[]): number {
    return 100 - this.calculateCycleIrregularity(cycles);
  }

  private static calculateAverageCycleLength(cycles: CycleEntry[]): number {
    if (cycles.length < 2) return 28;

    const lengths = cycles.slice(1).map((cycle, index) => {
      const prevCycle = cycles[index];
      return Math.abs(cycle.date.getTime() - prevCycle.date.getTime()) / (24 * 60 * 60 * 1000);
    });

    return lengths.reduce((sum, len) => sum + len, 0) / lengths.length;
  }

  // Generate PCOS-specific recommendations
  private static generatePCOSRecommendations(riskLevel: 'low' | 'moderate' | 'high'): string {
    switch (riskLevel) {
      case 'high':
        return 'High genetic risk for PCOS. Consider comprehensive hormonal evaluation, lifestyle modifications focusing on insulin sensitivity, and regular monitoring of cycle patterns. Genetic counseling recommended.';
      case 'moderate':
        return 'Moderate genetic predisposition to PCOS. Monitor for irregular cycles, weight changes, and excess hair growth. Consider annual hormonal screening.';
      case 'low':
        return 'Low genetic risk for PCOS, but maintain healthy lifestyle habits. Regular exercise and balanced diet support hormonal health.';
      default:
        return 'Monitor cycle regularity and consult healthcare provider if irregularities develop.';
    }
  }

  // Integrate with treatment planning
  static async optimizeTreatmentTiming(
    treatments: TreatmentCorrelation[],
    cycles: CycleEntry[],
    geneticInsights: GeneticInsight[]
  ): Promise<any[]> {
    const optimizedTimings: any[] = [];

    for (const treatment of treatments) {
      // Find optimal cycle phase for this treatment based on genetics
      const optimalPhase = this.determineOptimalTreatmentPhase(treatment, geneticInsights);

      // Calculate recommended dates
      const recommendations = await AIPredictionEngine.generateCyclePredictions(cycles, geneticInsights, treatments);

      optimizedTimings.push({
        treatmentId: treatment.treatmentId,
        optimalPhase,
        recommendedDates: this.calculateRecommendedDates(recommendations, optimalPhase),
        geneticFactors: geneticInsights.filter(g => g.relatedConditions.some(c =>
          treatment.outcome.toLowerCase().includes(c.toLowerCase())
        )),
        confidence: recommendations.confidence
      });
    }

    return optimizedTimings;
  }

  // Determine optimal treatment phase based on genetics
  private static determineOptimalTreatmentPhase(
    treatment: TreatmentCorrelation,
    geneticInsights: GeneticInsight[]
  ): 'menstrual' | 'follicular' | 'ovulation' | 'luteal' {
    // Default to follicular phase for most treatments
    let optimalPhase: 'menstrual' | 'follicular' | 'ovulation' | 'luteal' = 'follicular';

    // Adjust based on genetic insights
    const hormonalInsights = geneticInsights.filter(g =>
      g.trait.toLowerCase().includes('hormonal') ||
      g.trait.toLowerCase().includes('estrogen')
    );

    if (hormonalInsights.some(g => g.riskLevel === 'high')) {
      optimalPhase = 'follicular'; // Early cycle when estrogen is rising
    }

    const inflammatoryInsights = geneticInsights.filter(g =>
      g.trait.toLowerCase().includes('inflammation')
    );

    if (inflammatoryInsights.some(g => g.riskLevel === 'high')) {
      optimalPhase = 'luteal'; // Later cycle when inflammation may be higher
    }

    return optimalPhase;
  }

  // Calculate recommended treatment dates
  private static calculateRecommendedDates(
    predictions: any,
    optimalPhase: string
  ): Date[] {
    // This would calculate specific dates based on cycle phase
    // Simplified implementation
    const recommendedDates: Date[] = [];

    // Add dates in the optimal phase
    const phaseStart = new Date(predictions.nextPeriodStart);

    switch (optimalPhase) {
      case 'menstrual':
        // Days 1-5
        for (let i = 0; i < 5; i++) {
          recommendedDates.push(new Date(phaseStart.getTime() + i * 24 * 60 * 60 * 1000));
        }
        break;
      case 'follicular':
        // Days 6-13
        for (let i = 5; i < 13; i++) {
          recommendedDates.push(new Date(phaseStart.getTime() + i * 24 * 60 * 60 * 1000));
        }
        break;
      case 'ovulation':
        // Days 14-16
        for (let i = 13; i < 16; i++) {
          recommendedDates.push(new Date(phaseStart.getTime() + i * 24 * 60 * 60 * 1000));
        }
        break;
      case 'luteal':
        // Days 17-28
        for (let i = 16; i < 28; i++) {
          recommendedDates.push(new Date(phaseStart.getTime() + i * 24 * 60 * 60 * 1000));
        }
        break;
    }

    return recommendedDates;
  }
}