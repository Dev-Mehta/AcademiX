import { useState } from "react";
interface DPNode {
  i: number;
  j: number;
  valueI: string;
  valueJ: string;
  value: number;
  arrow: string;
  color?: string;
}

interface LCSTableProps {
  data: DPNode[][];
}
function DPCell({ value, i, j, textI, textJ, direction, color }: {
  value: number;
  i: number;
  j: number;
  textI: string;
  textJ: string;
  direction: string;
  color?: string;
}) 
{
  const divClass = "relative text-xs font-bold w-16 h-16 border border-gray-400 flex flex-col items-center justify-center " + color;
  return (
    <div className={divClass}>
      <div className="absolute top-0 left-0 p-1">{i},{j}</div>
      <div className="text-2xl">{value}</div>
      <div className="absolute bottom-0 left-0 p-1">{textI}</div>
      <div className="absolute bottom-0 right-0 p-1">{textJ}</div>
      <div className="absolute top-0 right-0 p-1 text-md font-bold">{direction}</div>
    </div>
  );
}

const LCSTable: React.FC<LCSTableProps> = ({ data }) => {
  return (
    <>
      {/* for each node create a box, that contains 
            main numeric value, in center and in bottom area like mobile navigation menu items, show i, j, string1[i], string2[j], arrow
            use tailwind css to style the box, and make it look like a table
            */}
      {/* <div className="flex flex-col w-full justify-center items-center font-mono"> */}
      {
        data.map((row, i) => (
          <div key={i} className="flex">
            {row.map((cell, j) => (
              <DPCell
                key={j}
                value={cell.value}
                i={cell.i}
                j={cell.j}
                textI={cell.valueI}
                textJ={cell.valueJ}
                direction={cell.arrow}
                color={cell.color}
              />
            ))}
          </div>
        ))
      }
      {/* </div> */}
    </>
  )
};

function LCS() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [result, setResult] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [steps, setSteps] = useState<DPNode[][]>([]);

  function lcs(text1: string, text2: string) {
    const dp = Array.from({ length: text1.length + 1 }, () => Array(text2.length + 1).fill(0));
    const table: DPNode[][] = [];
    for (let i = 0; i <= text1.length; i++) {
      const row: DPNode[] = [];
      for (let j = 0; j <= text2.length; j++) {
        row.push({
          i,
          j,
          valueI: " ",
          valueJ: " ",
          value: 0,
          arrow: " ",
          color: "bg-gray-200"
        });
      }
      table.push(row);
    }
    for (let i = 1; i <= text1.length; i++) {
      for (let j = 1; j <= text2.length; j++) {
        if (text1[i - 1] === text2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
          table[i][j].i = i;
          table[i][j].j = j;
          table[i][j].valueI = text1[i - 1];
          table[i][j].valueJ = text2[j - 1];
          table[i][j].value = dp[i][j];
          table[i][j].arrow = "↖️";
          table[i][j].color = "bg-green-200";
          table[i-1][j-1].color = "bg-green-200";

        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
          table[i][j].i = i;
          table[i][j].j = j;
          table[i][j].valueI = text1[i - 1];
          table[i][j].valueJ = text2[j - 1];
          table[i][j].value = dp[i][j];
          table[i][j].arrow = dp[i - 1][j] > dp[i][j - 1] ? "⬆️" : "⬅️";
        }
      }
    }
    setSteps(table);
    return dp[text1.length][text2.length];
  }
  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setError("");
    if (!text1 || !text2) {
      setError("Please enter both strings.");
      return;
    }
    setResult(lcs(text1, text2));
  }

  return (
    <div className='m-4 gap-4 justify-center items-center flex flex-col'>
      <div className="w-[80%]">
        <h1 className="font-bold text-3xl my-4">Longest Common Subsequence</h1>
        <form className="flex flex-col gap-4">
          <label>
            <span className="mr-2">String 1</span>
            <input type="text" name="text1" id="text1" className='border p-2 rounded-md' onChange={(e) => { setText1(e.target.value.trim()) }} />
          </label>
          <label>
            <span className="mr-2">String 2</span>
            <input type="text" name="text2" id="text2" className='border p-2 rounded-md' onChange={(e) => { setText2(e.target.value.trim()) }} />
          </label>
          <button
            className="bg-blue-500 text-white p-2 rounded-md"
            onClick={handleSubmit}>Submit</button>
        </form>
        {error && <p className="text-red-500">{error}</p>}
        {result && (
          <div>
            <h2>Result</h2>
            <p>Longest Common Subsequence is of length: {result}</p>
          </div>
        )}
        {steps.length > 0 && (
          <div>
            <h2 className="font-bold text-xl my-4">Steps</h2>
            <LCSTable data={steps} />
          </div>
        )}
      </div>
    </div>
  );
}

export default LCS;