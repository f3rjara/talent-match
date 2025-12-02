export interface MatchingCriteria {
  technicalSkills: {
    required: string[];
    preferred: string[];
    weight: number;
  };
  behavioralCompetencies: {
    required: string[];
    weight: number;
  };
  cognitiveSkills: {
    required: string[];
    weight: number;
  };
}

export interface Vacancy {
  id: string;
  vacancyId: number;
  tenantId: string;
  title: string;
  experienceRequired: string;
  location: string;
  availability: string;
  description: string;
  matchingCriteria: MatchingCriteria;
  status: 'open' | 'closed' | 'paused';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface VacancyResponse {
  vacancies: Vacancy[];
  total: number;
}
