const CHINESE_SURNAMES = [
  '李', '王', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴',
];

const CHINESE_GIVEN_NAMES = [
  '伟', '芳', '娜', '敏', '静', '丽', '强', '磊', '洋', '军',
  '杰', '娟', '涛', '超', '秀英', '霞', '平', '刚', '桂英', '丹',
];

export function generateChineseName(seed: string): string {
  const hash = Array.from(seed).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const surname = CHINESE_SURNAMES[hash % CHINESE_SURNAMES.length];
  const given1 = CHINESE_GIVEN_NAMES[Math.floor(hash / 8) % CHINESE_GIVEN_NAMES.length];
  const given2 = CHINESE_GIVEN_NAMES[Math.floor(hash / 64) % CHINESE_GIVEN_NAMES.length];
  return `${surname}${given1}${given2}`;
}
