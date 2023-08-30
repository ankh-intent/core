export interface RangeInterface {
    from: number;
    to: number;
}

export interface LocationInterface {
    line: number;
    column: number;
}

export interface PositionalInterface {
    source: SourceInterface;
    pos: number;
    origin: OriginInterface;
}

export interface OriginInterface extends LocationInterface {
    source: SourceInterface;

    toString(): string;
}

export interface SourceInterface {
    readonly content: string;
    readonly reference: any;

    range(): RangeInterface;
    at(index: number): string;
    extract(start: number, end: number): string;
    location(position: number): OriginInterface;
    position(location: LocationInterface): number;
    positional(position: number | LocationInterface): PositionalInterface;
    line(line: number): string;
}

export interface RegionInterface {
    readonly source: SourceInterface;
    readonly position: number;
    readonly positional: PositionalInterface;

    from: OriginInterface;
    to: OriginInterface;

    extract(): string;
}
