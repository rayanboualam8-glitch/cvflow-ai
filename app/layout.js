import './style.css';
export const metadata = {
  title: 'CVFlow AI - AI Resume Builder',
  description: 'Create a professional resume, cover letters, ATS score and interview preparation with AI.'
};
export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
