
/**
 * Handles saving solution data to Supabase.
 */

// We will use the cdn link for supabase-js in the HTML, or we can use a simple fetch if we want to avoid dependencies.
// Given strict CSP or environment, fetch is often safer if we just need to INSERT.
// However, using the client library is requested/implied by "supabase".
// I'll assume we can use the CDN or just raw REST calls.
// To keep it simple and dependency-light without npm, I'll use raw fetch for the REST API if possible,
// or just standard supabase-js from a CDN if available.
// Let's use raw 'fetch' to the Supabase REST API to avoid external script dependency issues if the user is offline,
// but usually Supabase requires the client.
// Actually, let's just stick to a clean class that expects the URL and KEY.

class SolutionSaver {
    constructor(supabaseUrl, supabaseKey) {
        this.supabaseUrl = supabaseUrl;
        this.supabaseKey = supabaseKey;
        this.accessToken = null;
    }

    async login(email, password) {
        try {
            const url = `${this.supabaseUrl}/auth/v1/token?grant_type=password`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'apikey': this.supabaseKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email, password: password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.msg || errorData.error_description || "Login failed" };
            }

            const data = await response.json();
            this.accessToken = data.access_token;
            return { success: true, token: this.accessToken };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async save(levelName, steps, path) {
        if (!this.supabaseUrl || !this.supabaseKey) {
            console.warn("Supabase credentials not provided.");
            return { error: "Missing config" };
        }

        const url = `${this.supabaseUrl}/rest/v1/solutions`;
        // Assuming table name is 'solutions'. User might need to create this.

        const data = {
            level: levelName,
            steps: steps,
            path: path,
            created_at: new Date().toISOString()
        };

        try {
            const headers = {
                'apikey': this.supabaseKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            };

            // Use Access Token if available (Authenticated User), otherwise Anon Key
            if (this.accessToken) {
                headers['Authorization'] = `Bearer ${this.accessToken}`;
            } else {
                headers['Authorization'] = `Bearer ${this.supabaseKey}`;
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const err = await response.text();
                return { error: err, status: response.status };
            }

            return { success: true };
        } catch (e) {
            return { error: e.message };
        }
    }

    async get(levelName) {
        if (!this.supabaseUrl || !this.supabaseKey) {
            console.warn("Supabase credentials not provided.");
            return { error: "Missing config" };
        }

        // Fetch the solution with the minimum steps for the given level
        const url = `${this.supabaseUrl}/rest/v1/solutions?level=eq.${encodeURIComponent(levelName)}&select=*&order=steps.asc&limit=1`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'apikey': this.supabaseKey,
                    'Authorization': `Bearer ${this.supabaseKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const err = await response.text();
                return { error: err, status: response.status };
            }

            const data = await response.json();
            if (data && data.length > 0) {
                return { success: true, data: data[0] };
            } else {
                return { success: false, error: "No solution found" };
            }
        } catch (e) {
            return { error: e.message };
        }
    }

    async selectAll(query = 'select=level,steps.min()&order=level') {
        if (!this.supabaseUrl || !this.supabaseKey) {
            console.warn("Supabase credentials not provided.");
            return { success: false, error: "Missing config" };
        }

        const url = `${this.supabaseUrl}/rest/v1/solutions?${query}`;

        try {
            const headers = {
                'apikey': this.supabaseKey,
                'Content-Type': 'application/json'
            };

            // Use Access Token if available
            if (this.accessToken) {
                headers['Authorization'] = `Bearer ${this.accessToken}`;
            } else {
                headers['Authorization'] = `Bearer ${this.supabaseKey}`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: headers
            });

            if (!response.ok) {
                const err = await response.text();
                return { success: false, error: err, status: response.status };
            }

            const data = await response.json();
            return { success: true, data: data };
        } catch (e) {
            return { success: false, error: e.message };
        }
    }
}
