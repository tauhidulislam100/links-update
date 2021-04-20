export function hasErrorMessage(err) {
    try {
      if(err && err.error && err.error.errors[0]) {
        return err.error.errors[0];
      }
      return null;
    } catch (error) {
      return null;
    }
}