import { InputComponent } from "./inputComponent";

export class KeyboardComponent extends InputComponent {
    private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
    private keyboardAttackKey: Phaser.Input.Keyboard.Key;
    private keyboardActionKey: Phaser.Input.Keyboard.Key;
    private keyboardAnterKey: Phaser.Input.Keyboard.Key;
    private keyW: Phaser.Input.Keyboard.Key;
    private keyS: Phaser.Input.Keyboard.Key;
    private keyA: Phaser.Input.Keyboard.Key;
    private keyD: Phaser.Input.Keyboard.Key;

    constructor(keyboardPlugin: Phaser.Input.Keyboard.KeyboardPlugin) {
        super();
        this.cursorKeys = keyboardPlugin.createCursorKeys();
        this.keyboardAttackKey = keyboardPlugin.addKey(
            Phaser.Input.Keyboard.KeyCodes.Z
        );
        this.keyboardActionKey = keyboardPlugin.addKey(
            Phaser.Input.Keyboard.KeyCodes.X
        );
        this.keyboardAnterKey = keyboardPlugin.addKey(
            Phaser.Input.Keyboard.KeyCodes.ENTER
        );

        // Add WASD keys
        this.keyW = keyboardPlugin.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyS = keyboardPlugin.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyA = keyboardPlugin.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = keyboardPlugin.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }

    get isUpDown(): boolean {
        return this.cursorKeys.up.isDown || this.keyW.isDown;
    }

    get isDownDown(): boolean {
        return this.cursorKeys.down.isDown || this.keyS.isDown;
    }

    get isLeftDown(): boolean {
        return this.cursorKeys.left.isDown || this.keyA.isDown;
    }

    get isRightDown(): boolean {
        return this.cursorKeys.right.isDown || this.keyD.isDown;
    }

    get isActionKeyJustDown(): boolean {
        return Phaser.Input.Keyboard.JustDown(this.keyboardActionKey);
    }

    get isAttackKeyJustDown(): boolean {
        return Phaser.Input.Keyboard.JustDown(this.keyboardAttackKey);
    }

    get isSelectKeyJustDown(): boolean {
        return Phaser.Input.Keyboard.JustDown(this.cursorKeys.shift);
    }

    get isEnterKeyJustDown(): boolean {
        return Phaser.Input.Keyboard.JustDown(this.keyboardAnterKey);
    }
}
