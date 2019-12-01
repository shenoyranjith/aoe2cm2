import Civilisation from "./Civilisation";
import Turn from "./Turn";
import {CivilisationEncoder} from "./CivilisationEncoder";
import {Assert} from "./Assert";

class Preset {

    public static readonly EMPTY: Preset = new Preset('', [], []);

    public static readonly NEW: Preset = new Preset('Change me', Civilisation.ALL, []);

    public static readonly NAC3_QUALIFICATION_BO7: Preset = new Preset('NAC3 Qualification BO7', Civilisation.ALL, [
        Turn.HOST_GLOBAL_PICK,
        Turn.GUEST_GLOBAL_PICK,
        Turn.HOST_GLOBAL_BAN,
        Turn.GUEST_GLOBAL_BAN,
        Turn.HOST_GLOBAL_PICK,
        Turn.GUEST_GLOBAL_PICK,
        Turn.GUEST_GLOBAL_PICK,
        Turn.HOST_GLOBAL_PICK,
    ]);

    public static readonly NAC3_QUALIFICATION_BO9: Preset = new Preset('NAC3 Qualification BO9', Civilisation.ALL, [
        Turn.HOST_GLOBAL_PICK,
        Turn.GUEST_GLOBAL_PICK,
        Turn.HOST_GLOBAL_BAN,
        Turn.GUEST_GLOBAL_BAN,
        Turn.HOST_GLOBAL_PICK,
        Turn.GUEST_GLOBAL_PICK,
        Turn.GUEST_GLOBAL_PICK,
        Turn.HOST_GLOBAL_PICK,
        Turn.HOST_GLOBAL_PICK,
        Turn.GUEST_GLOBAL_PICK,
    ]);


    public readonly name: string;
    public readonly encodedCivilisations: string;
    public readonly turns: Turn[];

    constructor(name: string, civilisations: Civilisation[], turns: Turn[] = []) {
        this.name = name;
        this.encodedCivilisations = CivilisationEncoder.encodeCivilisationArray(civilisations);
        this.turns = turns;
    }

    public static fromPojo(preset: { name: string, encodedCivilisations: string, turns: Turn[] } | undefined): Preset | undefined {
        if (preset === undefined) {
            return undefined;
        }
        Assert.isString(preset.name);
        Assert.isString(preset.encodedCivilisations);
        return new Preset(preset.name, CivilisationEncoder.decodeCivilisationArray(preset.encodedCivilisations), Turn.fromPojoArray(preset.turns));
    }

    public addTurn(turn: Turn) {
        this.turns.push(turn);
    }

    get civilisations(): Civilisation[] {
        return CivilisationEncoder.decodeCivilisationArray(this.encodedCivilisations);
    }
}

export default Preset;