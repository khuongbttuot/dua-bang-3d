import { BoardImage, BoardAspectRatio } from '../types';

interface BoardRawData {
  num: number;
  file: string;
  aspectRatio: BoardAspectRatio;
}

const rawBoards: BoardRawData[] = [
  { num: 1, file: '1.jpg', aspectRatio: '16:9' },
  { num: 2, file: '2.jpg', aspectRatio: '16:9' },
  { num: 3, file: '3.jpg', aspectRatio: '4:5' },
  { num: 4, file: '4.jpg', aspectRatio: '16:9' },
  { num: 6, file: '6.jpg', aspectRatio: '1:1' },
  { num: 7, file: '7.jpg', aspectRatio: '16:9' },
  { num: 8, file: '8.jpg', aspectRatio: '4:5' },
  { num: 9, file: '9.jpg', aspectRatio: '16:9' },
  { num: 10, file: '10.jpg', aspectRatio: '4:5' },
  { num: 11, file: '11.jpg', aspectRatio: '16:9' },
  { num: 12, file: '12.jpg', aspectRatio: '4:5' },
  { num: 13, file: '13.jpg', aspectRatio: '16:9' },
  { num: 14, file: '14.jpg', aspectRatio: '16:9' },
  { num: 15, file: '15.jpg', aspectRatio: '16:9' },
  { num: 16, file: '16.jpg', aspectRatio: '16:9' },
  { num: 17, file: '17.jpg', aspectRatio: '16:9' },
  { num: 18, file: '18.jpg', aspectRatio: '16:9' },
  { num: 19, file: '19.jpg', aspectRatio: '16:9' },
  { num: 20, file: '20.jpg', aspectRatio: '16:9' },
  { num: 22, file: '22.jpg', aspectRatio: '4:5' },
  { num: 24, file: '24.jpg', aspectRatio: '4:5' },
  { num: 25, file: '25.jpg', aspectRatio: '16:9' },
  { num: 26, file: '26.jpg', aspectRatio: '4:5' },
  { num: 27, file: '27.jpg', aspectRatio: '16:9' },
  { num: 28, file: '28.jpg', aspectRatio: '4:5' },
  { num: 29, file: '29.jpg', aspectRatio: '4:5' },
  { num: 30, file: '30.jpg', aspectRatio: '16:9' },
  { num: 31, file: '31.jpg', aspectRatio: '16:9' },
  { num: 32, file: '32.jpg', aspectRatio: '4:5' },
  { num: 33, file: '33.jpg', aspectRatio: '4:5' },
  { num: 36, file: '36.jpg', aspectRatio: '16:9' },
  { num: 37, file: '37.jpg', aspectRatio: '1:1' },
  { num: 38, file: '38.jpg', aspectRatio: '4:5' },
  { num: 39, file: '39.jpg', aspectRatio: '4:5' },
  { num: 40, file: '40.jpg', aspectRatio: '16:9' },
  { num: 42, file: '42.jpg', aspectRatio: '4:5' },
];

export const initialSampleBoards: BoardImage[] = rawBoards.map((item) => ({
  id: `board-${item.num}`,
  boardNumber: item.num,
  title: `Bảng Điểm #${item.num}`,
  subtitle: `Ảnh bảng điểm số ${item.num} (bảng điểm/${item.file})`,
  url: `/bang_diem/${item.file}`,
  theme: 'cyber',
  aspectRatio: item.aspectRatio,
  tags: [`#${item.num}`, 'Bảng Điểm', item.aspectRatio],
  dateAdded: Date.now(),
  notes: `Bảng xếp hạng #${item.num} từ thư mục bảng điểm`,
}));
