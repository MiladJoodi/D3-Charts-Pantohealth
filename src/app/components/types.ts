export type SinglePoint = [number, number | null];

export type MultiPoint = [number, (number | null)[]];

export type ChartData = {
  title: string;
  data: SinglePoint[] | MultiPoint[];
};
