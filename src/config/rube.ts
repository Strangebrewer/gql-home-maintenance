export type RubeConfig = {
  nextUrl: string;
};

export default (): RubeConfig => ({
  nextUrl: process.env.RUBE_OWID_NEXT_URL || '',
});
