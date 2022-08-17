import { normalizeSqlText } from "../normalizeSql";

describe('normalizeSqlText', () => {
  test('select', () => {
    const query = 'SELECT 1';
    const expected = ['select', '1'];
    expect(normalizeSqlText(query)).toStrictEqual(expected);
  });

  test('select from', () => {
    const query = 'SELECT col1, col2\nFROM sys.objects';
    const expected = ['select', 'col1,', 'col2', 'from', 'sys.objects'];
    expect(normalizeSqlText(query)).toStrictEqual(expected);
  })

  test('select from where', () => {
    const query = 'Select *\nFrom sys.objects\nWhere object_type_id = 1';
    const expected = ['select', '*', 'from', 'sys.objects', 'where', 'object_type_id', '=', '1'];
    expect(normalizeSqlText(query)).toStrictEqual(expected);
  });
});