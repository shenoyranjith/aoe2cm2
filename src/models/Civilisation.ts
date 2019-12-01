import GameVersion from "./GameVersion";

enum Name {
    ARABIA = "Arabia",
    ARENA = "Arena",
    CENOTES = "Cenotes",
    GOLDEN_PIT = "Golden Pit",
    HIDEOUT = "Hideout",
    ISLANDS = "Islands",
    MEDITERRANEAN = "Mediterranean",
    SERENGETI = "Serengeti",
    VALLEY = "Valley",
    CROSS = "Cross",
    FORTRESS = "Fortress",
    GRAVEYARDS = "Graveyards",
    LAND_MADNESS = "Land Madness",

    HIDDEN_PICK = "HIDDEN_PICK",
    HIDDEN_BAN = "HIDDEN_BAN",
    HIDDEN_SNIPE = "HIDDEN_SNIPE",
    HIDDEN = "HIDDEN",
    RANDOM = "RANDOM"
}

class Civilisation {

    public static readonly ARABIA:Civilisation = new Civilisation(Name.ARABIA, GameVersion.DEFINITIVE_EDITION);
    public static readonly ARENA:Civilisation = new Civilisation(Name.ARENA, GameVersion.DEFINITIVE_EDITION);
    public static readonly CENOTES:Civilisation = new Civilisation(Name.CENOTES, GameVersion.DEFINITIVE_EDITION);
    public static readonly GOLDEN_PIT:Civilisation = new Civilisation(Name.GOLDEN_PIT, GameVersion.DEFINITIVE_EDITION);
    public static readonly HIDEOUT:Civilisation = new Civilisation(Name.HIDEOUT, GameVersion.DEFINITIVE_EDITION);
    public static readonly ISLANDS:Civilisation = new Civilisation(Name.ISLANDS, GameVersion.DEFINITIVE_EDITION);
    public static readonly MEDITERRANEAN:Civilisation = new Civilisation(Name.MEDITERRANEAN, GameVersion.DEFINITIVE_EDITION);
    public static readonly SERENGETI:Civilisation = new Civilisation(Name.SERENGETI, GameVersion.DEFINITIVE_EDITION);
    public static readonly VALLEY:Civilisation = new Civilisation(Name.VALLEY, GameVersion.DEFINITIVE_EDITION);
    public static readonly CROSS:Civilisation = new Civilisation(Name.CROSS, GameVersion.DEFINITIVE_EDITION);
    public static readonly FORTRESS:Civilisation = new Civilisation(Name.FORTRESS, GameVersion.DEFINITIVE_EDITION);
    public static readonly GRAVEYARDS:Civilisation = new Civilisation(Name.GRAVEYARDS, GameVersion.DEFINITIVE_EDITION);
    public static readonly LAND_MADNESS:Civilisation = new Civilisation(Name.LAND_MADNESS, GameVersion.DEFINITIVE_EDITION);

    public static readonly RANDOM:Civilisation = new Civilisation(Name.RANDOM, GameVersion.DEFINITIVE_EDITION);

    public static readonly HIDDEN_PICK: Civilisation = new Civilisation(Name.HIDDEN_PICK, GameVersion.TECHNICAL);
    public static readonly HIDDEN_BAN: Civilisation = new Civilisation(Name.HIDDEN_BAN, GameVersion.TECHNICAL);
    public static readonly HIDDEN_SNIPE: Civilisation = new Civilisation(Name.HIDDEN_SNIPE, GameVersion.TECHNICAL);
    public static readonly HIDDEN: Civilisation = new Civilisation(Name.HIDDEN, GameVersion.TECHNICAL);

    // DO NOT CHANGE THE ORDER OF ELEMENTS IN THIS ARRAY!!!
    // ONLY APPEND NEW CIVILISATIONS AT THE END!!!
    public static readonly ALL = [
        Civilisation.ARABIA,
        Civilisation.ARENA,
        Civilisation.CENOTES,
        Civilisation.GOLDEN_PIT,
        Civilisation.HIDEOUT,
        Civilisation.ISLANDS,
        Civilisation.MEDITERRANEAN,
        Civilisation.SERENGETI,
        Civilisation.VALLEY,
        Civilisation.CROSS,
        Civilisation.FORTRESS,
        Civilisation.GRAVEYARDS,
        Civilisation.LAND_MADNESS
    ];

    public readonly name:Name;
    public readonly gameVersion:GameVersion;
    public isRandomlyChosenCiv: boolean = false;

    private constructor(name:Name, gameVersion:GameVersion){
        this.name = name;
        this.gameVersion = gameVersion;
    }

}

export default Civilisation;
