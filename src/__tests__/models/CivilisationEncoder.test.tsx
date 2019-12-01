import {CivilisationEncoder} from "../../models/CivilisationEncoder";
import Civilisation from "../../models/Civilisation";

it('encode empty yields 0', () => {
    const encoded = CivilisationEncoder.encodeCivilisationArray([]);
    expect(encoded).toEqual(CivilisationEncoder.toHexString(0));
    expect(encoded).toEqual('0');
});

it('all 35 civs yield 2^35-1', () => {
    const encoded = CivilisationEncoder.encodeCivilisationArray(Civilisation.ALL);
    expect(Civilisation.ALL.length).toEqual(13);
    expect(encoded).toEqual(CivilisationEncoder.toHexString(Math.pow(2, 13) - 1));
    expect(encoded).toEqual('1fff');
});

it('decode 0 yields empty array', () => {
    const decoded = CivilisationEncoder.decodeCivilisationArray('0');
    expect(decoded).toEqual([]);
});

it('decode 2^35-1 yields all civs', () => {
    const decoded = CivilisationEncoder.decodeCivilisationArray('1fff');
    expect(decoded).toEqual([...Civilisation.ALL].sort((a, b) => a.name.localeCompare(b.name)));

});

it('decode invalid yields empty array', () => {
    const decoded = CivilisationEncoder.decodeCivilisationArray('invalid');
    expect(decoded).toEqual([]);
});

