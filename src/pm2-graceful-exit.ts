/**
 * PM2 only receives an exit code plus a signal. For signal exits Node reports
 * a null code, which PM2 normalizes to 0 before applying `stop_exit_codes`.
 * Therefore 0 cannot safely mean "intentional shutdown" for a PM2-managed
 * process: SIGKILL would be mistaken for a clean stop and never restarted.
 */
// Keep the sentinel outside POSIX sysexits (64-78) and signal-derived 128+N.
export const PM2_GRACEFUL_EXIT_CODE = 90;
export const PM2_GRACEFUL_EXIT_CODE_ENV = 'BOTMUX_PM2_GRACEFUL_EXIT_CODE';

export function pm2ManagedExitConfig(): {
  stopExitCodes: number[];
  env: Record<string, string>;
} {
  return {
    stopExitCodes: [PM2_GRACEFUL_EXIT_CODE],
    env: { [PM2_GRACEFUL_EXIT_CODE_ENV]: String(PM2_GRACEFUL_EXIT_CODE) },
  };
}

/** Keep direct/foreground launches on the conventional successful exit code. */
export function gracefulProcessExitCode(env: NodeJS.ProcessEnv = process.env): number {
  return env[PM2_GRACEFUL_EXIT_CODE_ENV] === String(PM2_GRACEFUL_EXIT_CODE)
    ? PM2_GRACEFUL_EXIT_CODE
    : 0;
}
