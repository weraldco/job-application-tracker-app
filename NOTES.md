# USE QUERY

## SETUP

1.  install useQuery
    ```
    npm install @tanstack/react-query
    ```
2.  create a QueryClient
    ```
    export const queryClient = new QueryClient({
    defaultOptions: {
    	queries: {
    		staleTime: 1000 * 60, // 1 minute
    		gcTime: 1000 * 60 * 5, // 5 minutes
    		refetchOnWindowFocus: true,
    	},
    },
    });
    ```
3.  then above the SessionProvider put the QueryClientProvider, provided the client value
    ```
    <SessionProvider>
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    </SessionProvider>
    ```
4.  Create a fetcher utility

    ```
    export async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
        const res = await fetch(url, {
            ...options,
            headers: {
            "Content-Type": "application/json",
            ...(options?.headers || {}),
            },
        });

        if (!res.ok) throw new Error(`Error: ${res.status}`);

        return res.json();
    }

    // option -> "GET", "POST", "PUT", "PATCH", "DELETE"
    ```

## FETCHING DATA

1. make an api that GET tha data from the database,
2. in frontend import the useQuery first and your fetcher utility
3. then create a useQuery calling the data

```
    const { data, isLoading, error } = useQuery<Job[]>({
        queryKey: ["jobs"],
        queryFn: () => fetcher("/api/jobs"),
    });

    // data -> the data from your database
    // isLoading -> process of getting the data from db
    // error -> when fetching is not successful
```

## ADD NEW DATA MUTATION

1. Create api POST for creation of new data.
2. Create a mutation in client side

```
    const createJobMutation = useMutation({
        mutationFn: (newJob: Partial<Job>) =>
            fetcher<Job>("/api/jobs", {
            method: "POST",
            body: JSON.stringify(newJob),
            }),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jobs"] });
        },
    });
```

then in the handleSubmit btn

```
    createJobMutation.mutate({
        title: "Full Stack Dev",
        status: "APPLIED",
    });
```

## UPDATE DATA MUTATION

1. Create an api PUT or PATCH
2. create a mutation in client side

```
    const updateJobMutation = useMutation({
        mutationFn: (job: Job) =>
            fetcher<Job>(`/api/jobs/${job.id}`, {
            method: "PATCH",
            body: JSON.stringify(job),
            }),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jobs"] });
        },
    });
```

then in the handleUpdateBtn

```
    updateJobMutation.mutate({
        id: "1",
        title: "React Developer",
        status: "INTERVIEWING",
    });

```

## DELETE DATA MUTATION

1. Create an api DELETE
2. setup the mutation in client side

```
    const deleteJobMutation = useMutation({
        mutationFn: (id: string) =>
            fetcher(`/api/jobs/${id}`, {
            method: "DELETE",
            }),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jobs"] });
        },
    });

```

then in the deleteBtn

```
    deleteJobMutation.mutate(id)
```
