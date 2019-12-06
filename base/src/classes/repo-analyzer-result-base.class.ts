export class RepoAnalyzerResultBase<TData> {
  constructor(data: TData) {
    this.data = data;
  }

  data: TData;

  asJson(): string {
    return JSON.stringify(this.data, null, 2);
  }

  asPrettyString(): string {
    return 'No pretty print defined';
  }
}