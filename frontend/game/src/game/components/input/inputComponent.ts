export class InputComponent {
    private up: boolean;
    private down: boolean;
    private left: boolean;
    private right: boolean;
    private W: boolean;
    private S: boolean;
    private A: boolean;
    private D: boolean;
    private actionKey: boolean;
    private attackKey: boolean;
    private selectKey: boolean;
    private enterKey: boolean;
    constructor() {
        this.up = false;
        this.down = false;
        this.right = false;
        this.left = false;
        this.actionKey = false;
        this.attackKey = false;
        this.selectKey = false;
        this.enterKey = false;
        this.W = false;
        this.S = false;
        this.A = false;
        this.D = false;
    }
    get isUpDown(): boolean {
        return this.up;
    }
    set isUpDown(val: boolean) {
        this.up = val;
    }
    get isDownDown(): boolean {
        return this.down;
    }
    set isDownDown(val: boolean) {
        this.down = val;
    }
    get isLeftDown(): boolean {
        return this.left;
    }
    set isLeftDown(val: boolean) {
        this.left = val;
    }
    get isRightDown(): boolean {
        return this.right;
    }
    set isRightDown(val: boolean) {
        this.right = val;
    }
    get isWDown(): boolean {
        return this.W;
    }
    set isWDown(val: boolean) {
        this.W = val;
    }
    get isSDown(): boolean {
        return this.S;
    }

    set isSDown(val: boolean) {
        this.S = val;
    }
    get isADown(): boolean {
        return this.A;
    }
    set isADown(val: boolean) {
        this.A = val;
    }
    get isDDown(): boolean {
        return this.D;
    }
    set isDDown(val: boolean) {
        this.D = val;
    }

    get isActionKeyJustDown(): boolean {
        return this.actionKey;
    }
    set isActionKeyJustDown(val: boolean) {
        this.actionKey = val;
    }
    get isAttackKeyJustDown(): boolean {
        return this.attackKey;
    }
    set isAttackKeyJustDown(val: boolean) {
        this.attackKey = val;
    }
    get isSelectKeyJustDown(): boolean {
        return this.selectKey;
    }
    set isSelectKeyJustDown(val: boolean) {
        this.selectKey = val;
    }
    get isEnterKeyJustDown(): boolean {
        return this.selectKey;
    }
    set isEnterKeyJustDown(val: boolean) {
        this.selectKey = val;
    }

    public reset(): void {
        this.actionKey = false;
        this.attackKey = false;
        this.selectKey = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.up = false;
        this.enterKey = false;
        this.W = false;
        this.S = false;
        this.A = false;
        this.D = false;
    }
}
