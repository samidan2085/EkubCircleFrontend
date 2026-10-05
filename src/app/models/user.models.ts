export interface LoginRequest {
  username: string; // As per project rules, username is FullName/Name, not email
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}