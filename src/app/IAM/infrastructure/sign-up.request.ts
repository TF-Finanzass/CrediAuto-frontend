/**
 * Request interface for sign-up API calls in the infrastructure layer of the IAM bounded context.
 */
export interface SignUpRequest {
  username: string;
  password: string;
  role: string;
}
