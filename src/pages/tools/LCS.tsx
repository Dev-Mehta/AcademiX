import React, { useState } from "react";
import AlgorithmPageLayout from '@/components/AlgorithmPageLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface DPNode {
  val: number;
  direction: 'diag' | 'up' | 'left' | 'none';
}

function LCS() {
  const codeSnippet = `function longestCommonSubsequence(text1, text2) {
    const dp = Array(text1.length + 1).fill(0).map(() => Array(text2.length + 1).fill(0));
    
    for(let i = 1; i <= text1.length; i++) {
        for(let j = 1; j <= text2.length; j++) {
            if(text1[i-1] === text2[j-1]) {
                dp[i][j] = dp[i-1][j-1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
            }
        }
    }
    return dp[text1.length][text2.length];
}`;

  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [resultLength, setResultLength] = useState<number | null>(null);
  const [lcsString, setLcsString] = useState<string>("");
  const [dpTable, setDpTable] = useState<DPNode[][]>([]);
  const [path, setPath] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!text1 || !text2) {
      setError("Please enter both strings.");
      return;
    }

    const m = text1.length;
    const n = text2.length;
    const dp: DPNode[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill({ val: 0, direction: 'none' }));

    // Fill DP
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (text1[i - 1] === text2[j - 1]) {
          dp[i][j] = { val: dp[i - 1][j - 1].val + 1, direction: 'diag' };
        } else {
          if (dp[i - 1][j].val >= dp[i][j - 1].val) {
            dp[i][j] = { val: dp[i - 1][j].val, direction: 'up' };
          } else {
            dp[i][j] = { val: dp[i][j - 1].val, direction: 'left' };
          }
        }
      }
    }

    setResultLength(dp[m][n].val);
    setDpTable(dp);

    // Backtrack
    let i = m;
    let j = n;
    let lcs = "";
    const newPath = new Set<string>();

    while (i > 0 && j > 0) {
      newPath.add(`${i},${j}`);
      if (text1[i - 1] === text2[j - 1]) {
        lcs = text1[i - 1] + lcs;
        i--;
        j--;
      } else if (dp[i - 1][j].val >= dp[i][j - 1].val) {
        i--;
      } else {
        j--;
      }
    }

    // Add start of path if needed, or cells visited.
    setLcsString(lcs);
    setPath(newPath);
  };

  return (
    <AlgorithmPageLayout
      title="Longest Common Subsequence"
      description="Finds the longest subsequence present in both of the given strings. The subsequence is a sequence that appears in the same relative order, but not necessarily contiguous."
      resources={[
        { label: "What is LCS", url: "https://en.wikipedia.org/wiki/Longest_common_subsequence" },
        // { label: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/longest-common-subsequence-dp-4/" }
      ]}
      codeSnippet={codeSnippet}
      controls={
        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">String 1</label>
            <Input
              placeholder="e.g. ABCBDAB"
              value={text1}
              onChange={(e) => setText1(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">String 2</label>
            <Input
              placeholder="e.g. BDCABA"
              value={text2}
              onChange={(e) => setText2(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full">
            Find LCS
          </Button>
        </form>
      }
    >
      {resultLength !== null && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg bg-blue-50/50">
              <h3 className="font-bold text-lg mb-2 text-blue-800">LCS Length</h3>
              <p className="text-3xl font-mono">{resultLength}</p>
            </div>
            <div className="p-4 border rounded-lg bg-green-50/50">
              <h3 className="font-bold text-lg mb-2 text-green-800">LCS String</h3>
              <p className="text-xl font-mono tracking-widest">{lcsString || "(Empty)"}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold">DP Table</h3>
            <p className="text-xs text-muted-foreground">Arrows indicate the direction taken during calculation. Highlighted cells show the backtrack path.</p>
            <div className="overflow-x-auto">
              <table className="border-collapse text-sm text-center">
                <thead>
                  <tr>
                    <th className="p-2 border border-gray-800 bg-gray-400"></th>
                    <th className="p-2 border border-gray-800 bg-gray-400"></th>
                    {Array.from(text2).map((char, index) => (
                      <th key={index} className="p-2 border border-gray-400 font-mono bg-muted">{char}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dpTable.map((row, i) => (
                    <tr key={i}>
                      <td className="p-2 border border-gray-400 font-mono bg-muted font-bold">
                        {i === 0 ? "" : text1[i - 1]}
                      </td>
                      {row.map((cell, j) => {
                        const isPath = path.has(`${i},${j}`);
                        return (
                          <td key={j} className={`p-2 border border-gray-400 border-black min-w-[3rem] h-12 relative ${isPath ? "bg-green-200 font-bold" : ""}`}>
                            {cell.direction === 'diag' && <span className="absolute top-1 left-1 text-[0.6rem] text-muted-foreground">↖️</span>}
                            {cell.direction === 'up' && <span className="absolute top-1 left-1 text-[0.6rem] text-muted-foreground">⬆️</span>}
                            {cell.direction === 'left' && <span className="absolute top-1 left-1 text-[0.6rem] text-muted-foreground">⬅️</span>}
                            {cell.val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {!resultLength && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <p>Enter strings calculate LCS.</p>
        </div>
      )}
    </AlgorithmPageLayout>
  );
}

export default LCS;