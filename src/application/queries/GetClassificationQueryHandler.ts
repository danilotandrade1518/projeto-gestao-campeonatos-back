import {
  ClassificationDAO,
  TeamClassification,
} from '../protocols/ClassificationDAO';

export class GetClassificationQueryHandler {
  constructor(private readonly classificationDAO: ClassificationDAO) {}

  async execute(): Promise<TeamClassification[]> {
    return await this.classificationDAO.getClassification();
  }
}
