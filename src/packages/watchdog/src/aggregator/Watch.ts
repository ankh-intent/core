export class Watch {
    private readonly callback: Function;
    private timer: any;
    private started: number | null = null;

    public constructor(callback: Function) {
        this.callback = callback;
    }

    public bounce(delay: number) {
        if (this.timer) {
            clearTimeout(this.timer);
        }

        if (!this.started) {
            this.started = +new Date();
        }

        this.timer = setTimeout(() => {
            if (this.started) {
                const delta = (+new Date()) - this.started;
                this.timer = null;
                this.started = null;
                this.callback(delta);
            }
        }, delay);
    }

    public cancel() {
        clearTimeout(this.timer);
        this.timer = null;
        this.started = null;
    }
}
