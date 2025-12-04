// Sub-interfaces para Matching Criteria
export interface TechnicalSkills {
  required: string[];
  preferred: string[];
  weight: number;
}

export interface BehavioralCompetencies {
  required: string[];
  weight: number;
}

export interface CognitiveSkills {
  required: string[];
  weight: number;
}

export interface MatchingCriteria {
  technicalSkills: TechnicalSkills;
  behavioralCompetencies: BehavioralCompetencies;
  cognitiveSkills: CognitiveSkills;
}

// Interface principal de Vacancy
export interface Vacancy {
  id?: string;
  vacancyId: number;
  tenantId: string;
  title: string;
  experienceRequired: string;
  location: string;
  availability: string;
  description: string;
  matchingCriteria: MatchingCriteria;
  status: 'draft' | 'published' | 'closed';
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;

  // Campos legacy para compatibilidad (pueden removerse después)
  titulo?: string;
  experiencia?: string;
  ubicacion?: string;
  disponibilidad?: string;
}

export interface VacancyResponse {
  vacancies: Vacancy[];
  total: number;
}
