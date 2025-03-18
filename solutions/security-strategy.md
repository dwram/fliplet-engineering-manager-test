# Security Strategy: JWT Expiry Fix
## Problem
Tokens never expire.

## Solution
1. User submits authentication credentials
2. Server validates credentials and creates session
3. Server creates access token, refresh token and CSRF token
   - Signed with a private key instantiated at server boot (IP-based sticky session for maintaining user state and app performance)
   - Short-lived (1hr) access token is sent in memory
   - Refresh token is Secure, HTTP-only and has SameSite=Strict
   - Server stores the CSRF token against the session created in the window object
4. On consecutive requests made the client sends the in-memory access token as Authorization header, and CSRFToken as CSRF header, with refresh token via 'include'.
5. If access token is invalid, server checks refresh token against the user session and CSRF token validity. 

### Migration plan

0. Send email to users informing them of new security measures
1. Support both in-memory token alongside existing access token method
2. All new users/authentication attempts use the new system
3. Add instrumentation to monitor token usage patterns
4. Deploy server code that checks if the token never expires, if it does, return new tokens in the response with unique header e.g. X-Token-Migration
5. Deploy client side interceptor that checks for the header and sets the new access token
6. Update documentation and hel-centre/FAQs as needed
7. Run external penetration test with white-hat firm


### Risks

Session loss on page refresh
Multiple tab sync issues
Increased server load (more frequent token refreshes now happening)
Legacy browser incompatibility
Bots/automation breaking depending on how long-lived access tokens were previously handled
