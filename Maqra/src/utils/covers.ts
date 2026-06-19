export const DEFAULT_COVERS = [
  require('../assets/images/cover1.jpg'),
  require('../assets/images/cover2.jpg'),
  require('../assets/images/cover3.jpg'),
  require('../assets/images/cover4.jpg'),
  require('../assets/images/cover5.jpg'),
  require('../assets/images/cover6.jpg'),
  require('../assets/images/cover7.jpg')
];

export const getCoverForBook = (book: any) => {
  if (book.coverImage) {
    if (typeof book.coverImage === 'string' && book.coverImage.includes('placeholder')) {
      // Skip placeholders and use default logic below
    } else {
      return book.coverImage;
    }
  }
  const index = (book.title?.length || 0) % DEFAULT_COVERS.length;
  return DEFAULT_COVERS[index];
};
