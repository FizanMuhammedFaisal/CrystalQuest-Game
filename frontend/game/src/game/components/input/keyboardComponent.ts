import { InputComponent } from "./inputComponent";

export class KeyboardComponent extends InputComponent {
    private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
    private keyboardAttackKey: Phaser.Input.Keyboard.Key;
    private keyboardActionKey: Phaser.Input.Keyboard.Key;
    private keyboardAnterKey: Phaser.Input.Keyboard.Key;
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
    }
    get isUpDown(): boolean {
        return this.cursorKeys.up.isDown;
    }

    get isDownDown(): boolean {
        return this.cursorKeys.down.isDown;
    }

    get isLeftDown(): boolean {
        return this.cursorKeys.left.isDown;
    }

    get isRightDown(): boolean {
        return this.cursorKeys.right.isDown;
    }

    get iskeyboardActionKeyJustDown(): boolean {
        return Phaser.Input.Keyboard.JustDown(this.keyboardActionKey);
    }

    get iskeyboardAttackKeyJustDown(): boolean {
        return Phaser.Input.Keyboard.JustDown(this.keyboardAttackKey);
    }

    get isSelectKeyJustDown(): boolean {
        return Phaser.Input.Keyboard.JustDown(this.cursorKeys.shift);
    }

    get iskeyboardAnterKeyJustDown(): boolean {
        return Phaser.Input.Keyboard.JustDown(this.keyboardAnterKey);
    }
}
