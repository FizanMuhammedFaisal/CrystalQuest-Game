export class InputComponent {
    private up: boolean;
    private down: boolean;
    private left: boolean;
    private right: boolean;
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
    }
}
