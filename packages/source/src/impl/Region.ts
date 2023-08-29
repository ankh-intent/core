import { OriginInterface, SourceInterface, RegionInterface } from '../interfaces';

export class Region implements RegionInterface {
    public from: OriginInterface;
    public to: OriginInterface;

    public constructor(from: OriginInterface, to: OriginInterface) {
        this.from = from;
        this.to = to;
    }

    get source(): SourceInterface {
        return this.from.source;
    }

    get position() {
        return this.source.position(this.from);
    }

    extract(): string {
        const source = this.source;

        return source.extract(
            source.position(this.from),
            source.position(this.to),
        );
    }
}
