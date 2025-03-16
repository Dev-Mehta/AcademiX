import React, { useEffect, useState } from 'react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../../components/accordion"
import { CopyBlock, dracula } from 'react-code-blocks'


function LCS() {
  const codeSnipper = ``;
  const [value, setValue] = useState('');
  const [pattern, setPattern] = useState('');  

  const handleSubmit = () => {
    
  }

  return (
      <div className='m-4 gap-4 justify-center items-center flex flex-col'>
        <div className="w-[80%]">
          <h1 className="text-2xl font-bold">Bubble Sort</h1>
          <p className='text-xl my-2 prose'><a href='https://en.wikipedia.org/wiki/Bubble_sort'>:    Explanation</a></p>
          <Accordion type="single" collapsible className="" defaultValue={'item-1'}>
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-2xl font-bold">Algorithm?</AccordionTrigger>
              <AccordionContent className='font-mono w-full'>
  
                <CopyBlock
                  text={codeSnippet}
                  language="JavaScript"
                  theme={dracula}
                  codeBlock></CopyBlock>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <form className='flex flex-col gap-2 w-96'>
            String: <input type="text" name="value" id="value" className='border p-2 rounded-md' onChange={(e) => { setValue(e.target.value) }} />
            Pattern: <input type="text" name="pattern" id="pattern" className='border p-2 rounded-md' onChange={(e) => { setValue(e.target.value) }} />

            <button type='button' className='bg-blue-500 text-white p-2 rounded-md' onClick={(event) => { handleSubmit(event) }}>Calculate</button>
          </form>
          <div id="output">
            
  
          </div>
        </div>
      </div>
    )
}

export default LCS