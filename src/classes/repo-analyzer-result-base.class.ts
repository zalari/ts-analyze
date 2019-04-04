export class RepoAnalyzerResultBase<T> {
    constructor(data: T) {
        this.data = data;
    }

    data: T;

    asJson(): string {
        return JSON.stringify(this.data, null, 2);
    }

    asPrettyString(): string {
        return 'No pretty print defined';
    }
}