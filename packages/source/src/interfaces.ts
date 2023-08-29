export interface RangeInterface {
    from: number;
    to: number;
}

export interface LocationInterface {
    line: number;
    column: number;
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
}

export interface RegionInterface {
    readonly source: SourceInterface;
    readonly position: number;
    from: OriginInterface;
    to: OriginInterface;

    extract(): string;
}
