declare module '*.module.css';
declare module '*.module.scss';

declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.ejs' {
  const content: any;
  export default content;
}
