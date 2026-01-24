import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface BlueprintInsight {
  id: string;
  vaultId: string;
  source: 'LAB' | 'FAMILY' | 'TOOL' | 'DOCUMENT';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  createdAt: Date;
}

export class BlueprintIntelligenceEngine {
  /**
   * P0 PHASE 2: BLUEPRINT SCORING LOGIC — V1 INTELLIGENCE ENGINE
   *
   * This is NOT medical advice. This is priority awareness.
   *
   * Inputs: Abnormal/borderline labs, recurrent family conditions, missing docs, tool flags
   * Output: Priority (High/Medium/Low) + plain-language messages only
   * Rules: No predictions, no percentages, no diagnoses
   */

  async generateInsights(vaultId: string): Promise<BlueprintInsight[]> {
    const insights: BlueprintInsight[] = [];

    // Analyze lab data
    const labInsights = await this.analyzeLabData(vaultId);
    insights.push(...labInsights);

    // Analyze family history
    const familyInsights = await this.analyzeFamilyHistory(vaultId);
    insights.push(...familyInsights);

    // Analyze tool outputs
    const toolInsights = await this.analyzeToolOutputs(vaultId);
    insights.push(...toolInsights);

    // Analyze document completeness
    const documentInsights = await this.analyzeDocumentCompleteness(vaultId);
    insights.push(...documentInsights);

    // Save insights to database
    await this.saveInsights(vaultId, insights);

    return insights;
  }

  private async analyzeLabData(vaultId: string): Promise<BlueprintInsight[]> {
    const insights: BlueprintInsight[] = [];

    // Get all lab results for this vault
    const labResults = await prisma.labResult.findMany({
      where: {
        vaultItem: {
          vaultId: vaultId
        }
      },
      include: {
        vaultItem: true
      }
    });

    // Count abnormal/borderline flags
    const abnormalCount = labResults.filter(result =>
      result.flags.includes('abnormal') || result.flags.includes('borderline')
    ).length;

    if (abnormalCount > 0) {
      if (abnormalCount >= 3) {
        insights.push({
          id: `lab_${vaultId}_${Date.now()}_high`,
          vaultId,
          source: 'LAB',
          priority: 'HIGH',
          message: 'Multiple lab results may be worth reviewing with your healthcare provider.',
          createdAt: new Date()
        });
      } else {
        insights.push({
          id: `lab_${vaultId}_${Date.now()}_medium`,
          vaultId,
          source: 'LAB',
          priority: 'MEDIUM',
          message: 'Some lab results are outside normal ranges.',
          createdAt: new Date()
        });
      }
    }

    // Check for repeated abnormal labs
    const abnormalTests = labResults
      .filter(result => result.flags.includes('abnormal'))
      .map(result => result.testName);

    const repeatedAbnormals = abnormalTests.filter(
      (test, index) => abnormalTests.indexOf(test) !== index
    );

    if (repeatedAbnormals.length > 0) {
      insights.push({
        id: `lab_repeated_${vaultId}_${Date.now()}`,
        vaultId,
        source: 'LAB',
        priority: 'HIGH',
        message: 'Some lab tests have repeatedly shown abnormal results.',
        createdAt: new Date()
      });
    }

    return insights;
  }

  private async analyzeFamilyHistory(vaultId: string): Promise<BlueprintInsight[]> {
    const insights: BlueprintInsight[] = [];

    // Get all family members for this vault
    const familyMembers = await prisma.familyMember.findMany({
      where: { vaultId }
    });

    // Group conditions by type
    const conditionCounts: Record<string, number> = {};
    familyMembers.forEach(member => {
      member.conditionTags.forEach(condition => {
        conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
      });
    });

    // Generate insights for recurring conditions
    Object.entries(conditionCounts).forEach(([condition, count]) => {
      if (count >= 2) {
        insights.push({
          id: `family_${condition}_${vaultId}_${Date.now()}`,
          vaultId,
          source: 'FAMILY',
          priority: count >= 3 ? 'HIGH' : 'MEDIUM',
          message: `${condition} appears in multiple family members.`,
          createdAt: new Date()
        });
      }
    });

    return insights;
  }

  private async analyzeToolOutputs(vaultId: string): Promise<BlueprintInsight[]> {
    const insights: BlueprintInsight[] = [];

    // Get tool output vault items
    const toolOutputs = await prisma.vaultItem.findMany({
      where: {
        vaultId,
        type: 'TOOL_OUTPUT'
      }
    });

    // For now, this is a placeholder for future tool analysis
    // Tools will save structured outputs to vault items
    if (toolOutputs.length > 0) {
      insights.push({
        id: `tools_${vaultId}_${Date.now()}`,
        vaultId,
        source: 'TOOL',
        priority: 'LOW',
        message: 'Health tools have been used to analyze your data.',
        createdAt: new Date()
      });
    }

    return insights;
  }

  private async analyzeDocumentCompleteness(vaultId: string): Promise<BlueprintInsight[]> {
    const insights: BlueprintInsight[] = [];

    // Get all vault items
    const vaultItems = await prisma.vaultItem.findMany({
      where: { vaultId }
    });

    // Check for basic document types
    const hasLabs = vaultItems.some(item => item.type === 'LAB');
    const hasFamily = await prisma.familyMember.count({ where: { vaultId } }) > 0;

    if (!hasLabs) {
      insights.push({
        id: `docs_labs_${vaultId}_${Date.now()}`,
        vaultId,
        source: 'DOCUMENT',
        priority: 'MEDIUM',
        message: 'Consider adding lab results to build a more complete health picture.',
        createdAt: new Date()
      });
    }

    if (!hasFamily) {
      insights.push({
        id: `docs_family_${vaultId}_${Date.now()}`,
        vaultId,
        source: 'DOCUMENT',
        priority: 'MEDIUM',
        message: 'Family health history helps identify important patterns.',
        createdAt: new Date()
      });
    }

    return insights;
  }

  private async saveInsights(vaultId: string, insights: BlueprintInsight[]): Promise<void> {
    // Clear existing insights for this vault
    await prisma.blueprintInsight.deleteMany({
      where: { vaultId }
    });

    // Save new insights
    if (insights.length > 0) {
      await prisma.blueprintInsight.createMany({
        data: insights.map(insight => ({
          vaultId: insight.vaultId,
          source: insight.source,
          priority: insight.priority,
          message: insight.message
        }))
      });
    }
  }

  async getInsights(vaultId: string): Promise<BlueprintInsight[]> {
    const insights = await prisma.blueprintInsight.findMany({
      where: { vaultId },
      orderBy: { createdAt: 'desc' }
    });

    return insights;
  }
}