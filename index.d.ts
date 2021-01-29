export declare type ShouldStripWhitespace = (value: string) => boolean;
export interface StripWhitespaceOptions {
    shouldStripWhitespace?: ShouldStripWhitespace;
}
export interface StringReplacement {
    end: number;
    start: number;
    text: string;
}
export interface Result {
    code: string;
    replacements: StringReplacement[];
}
export default class StripWhitespace {
    private shouldStripWhitespace;
    constructor(options?: StripWhitespaceOptions);
    strip(code: string): Result;
    private stripString;
    private getStringReplacements;
    private makeAllReplacements;
    private sortReplacements;
    private createWalker;
}
