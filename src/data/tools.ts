export interface Tool {
    id: string;
    title: string;
    path: string;
    wikiLink: string;
    category: "Computer Organization" | "Discrete Math" | "Algorithms" | "Other";
    description: string;
}

export const toolsData: Tool[] = [
    {
        id: "booths-algorithm",
        title: "Booth's Algorithm",
        path: "/tools/booths-algorithm",
        wikiLink: "https://en.wikipedia.org/wiki/Booth%27s_multiplication_algorithm",
        category: "Computer Organization",
        description: "Multiplication algorithm for signed binary numbers"
    },
    {
        id: "number-conversion",
        title: "Number Conversion",
        path: "/tools/number-conversion",
        wikiLink: "https://en.wikipedia.org/wiki/Binary_number#Conversion_to_and_from_other_numeral_systems",
        category: "Computer Organization",
        description: "Convert between binary, octal, decimal, and hexadecimal"
    },
    {
        id: "binary-arithmetic",
        title: "Binary Arithmetic",
        path: "/tools/binary-arithmetic",
        wikiLink: "https://en.wikipedia.org/wiki/Binary_number#Binary_arithmetic",
        category: "Computer Organization",
        description: "Addition and subtraction of binary numbers"
    },
    {
        id: "poset",
        title: "POSET",
        path: "/tools/poset",
        wikiLink: "https://en.wikipedia.org/wiki/Partially_ordered_set",
        category: "Discrete Math",
        description: "Partially Ordered Sets visualization"
    },
    {
        id: "division-algorithm",
        title: "Booth's Division Algorithm",
        path: "/tools/division-algorithm",
        wikiLink: "https://en.wikipedia.org/wiki/Division_algorithm#Restoring_division",
        category: "Computer Organization",
        description: "Division algorithm for signed binary numbers"
    },
    {
        id: "warshall-algorithm",
        title: "Floyd-Warshall Algorithm",
        path: "/tools/warshall-algorithm",
        wikiLink: "https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm",
        category: "Discrete Math",
        description: "Shortest paths in a weighted graph"
    },
    {
        id: "bubble-sort",
        title: "Bubble Sort",
        path: "/tools/bubble-sort",
        wikiLink: "https://en.wikipedia.org/wiki/Bubble_sort",
        category: "Algorithms",
        description: "Simple sorting algorithm"
    },
    {
        id: "selection-sort",
        title: "Selection Sort",
        path: "/tools/selection-sort",
        wikiLink: "https://en.wikipedia.org/wiki/Selection_sort",
        category: "Algorithms",
        description: "In-place comparison sorting algorithm"
    },
    {
        id: "insertion-sort",
        title: "Insertion Sort",
        path: "/tools/insertion-sort",
        wikiLink: "https://en.wikipedia.org/wiki/Insertion_sort",
        category: "Algorithms",
        description: "Builds the final sorted array one item at a time"
    },
    {
        id: "fractional-knapsack",
        title: "Fractional Knapsack",
        path: "/tools/fractional-knapsack",
        wikiLink: "https://en.wikipedia.org/wiki/Continuous_knapsack_problem",
        category: "Algorithms",
        description: "Greedy algorithm for the knapsack problem"
    },
    {
        id: "0-1-knapsack",
        title: "0/1 Knapsack",
        path: "/tools/0-1-knapsack",
        wikiLink: "https://en.wikipedia.org/wiki/Knapsack_problem",
        category: "Algorithms",
        description: "Dynamic programming solution for the knapsack problem"
    },
    {
        id: "merge-sort",
        title: "Merge Sort",
        path: "/tools/merge-sort",
        wikiLink: "https://en.wikipedia.org/wiki/Merge_sort",
        category: "Algorithms",
        description: "Divide and conquer sorting algorithm"
    },
    {
        id: "quick-sort",
        title: "Quick Sort",
        path: "/tools/quick-sort",
        wikiLink: "https://en.wikipedia.org/wiki/Quicksort",
        category: "Algorithms",
        description: "Efficient divide and conquer sorting algorithm"
    },
    {
        id: "matrix-chain-multiplication",
        title: "MCM (Matrix Chain Multiplication)",
        path: "/tools/matrix-chain-multiplication",
        wikiLink: "https://en.wikipedia.org/wiki/Matrix_chain_multiplication",
        category: "Algorithms",
        description: "Optimization problem for matrix multiplication"
    },
    {
        id: "string-matching",
        title: "String Matching",
        path: "/tools/string-matching",
        wikiLink: "https://en.wikipedia.org/wiki/String-searching_algorithm",
        category: "Algorithms",
        description: "Find occurrences of a pattern in a text"
    },
    {
        id: "longest-common-subsequence",
        title: "Longest Common Subsequence",
        path: "/tools/longest-common-subsequence",
        wikiLink: "https://en.wikipedia.org/wiki/Longest_common_subsequence",
        category: "Algorithms",
        description: "Dynamic programming problem"
    },
    {
        id: "eulerian-path",
        title: "Eulerian Path",
        path: "/tools/eulerian-path",
        wikiLink: "https://en.wikipedia.org/wiki/Eulerian_path",
        category: "Discrete Math",
        description: "Find Eulerian Path/Circuit in a graph"
    }
];
