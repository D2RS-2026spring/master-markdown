declare module 'connect-sqlite3' {
  import session from 'express-session';
  function connectSQLite3(session: typeof session): any;
  export default connectSQLite3;
}
