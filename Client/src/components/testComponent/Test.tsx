import { Stack } from "@mui/material";
import Timer from "../Timer";
import { useEffect, useState } from "react";
import GAME_STATUS from "../../utils/game_status";
import ResultCard from "../ResultCard";

const Test = () => {
  const [gameFinished, setGameFinished] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setGameFinished(true);
    }, 3000);
  }, []);
  return (
    <>
      <div style={{
        height: '100vh',
        backgroundColor: 'red',
        fontSize: '20rem',
      }}>Hello</div>
      {gameFinished &&
        <ResultCard 
          status={GAME_STATUS[1]}
          rank={-10}
          level={0}
        />
      }
    </>
  )
  // const problem = '';
  // return ( problem &&
    
  // );
  // return (           

//             {/* <Box
//               height={540}
//               sx={{
//                 backgroundColor: '#0F0C29',
//                 borderRadius: '1.3rem',
//                 boxShadow: '0 0 0.3rem',
//                 width: '100%',
//               }}
//             >
//               <Box
//                 width={'100%'}
//                 height={'5rem'}
//                 display={'flex'}
//                 alignItems={'center'}
//                 sx={{
//                   backgroundColor: '#24243e',
//                   borderRadius: '1.3rem 1.3rem 0 0',
//                 }}
//               >
//                 <Stack ml={'4rem'} direction={'row'}>
//                   <Stack>
//                     <Button
//                       disableRipple
//                       onClick={() => setTestcaseOption('testcase')}
//                       sx={{
//                         color: 'white',
//                         display: 'flex',
//                         gap: '1rem',
//                         fontSize: '1.8rem',
//                         textTransform: 'capitalize',
//                         opacity:
//                           testcaseOption === 'testcase' ? '100%' : '40%',
//                         transition: 'opacity 0.3s',
//                       }}
//                     >
//                   <Box
//                     sx={{
//                       width: '100%',
//                       backgroundColor: '#24243E',
//                       height: '0.3rem',
//                       margin: '2rem 0',
//                     }}
//                   />
//                   <CodeEditor language={language} gameID={gameId} />
//                 </Box>
//                 {/* <Box
//                   height={540}
//                   sx={{
//                     backgroundColor: '#0F0C29',
//                     borderRadius: '1.3rem',
//                     boxShadow: '0 0 0.3rem',
//                     width: '100%',
//                   }}
//                 >
//                   <Box
//                     width={'100%'}
//                     height={'5rem'}
//                     display={'flex'}
//                     alignItems={'center'}
//                     sx={{
//                       backgroundColor: '#24243e',
//                       borderRadius: '1.3rem 1.3rem 0 0',
//                     }}
//                   >
//                     <Stack ml={'4rem'} direction={'row'}>
//                       <Stack>
//                         <Button
//                           disableRipple
//                           onClick={() => setTestcaseOption('testcase')}
//                           sx={{
//                             color: 'white',
//                             display: 'flex',
//                             gap: '1rem',
//                             fontSize: '1.8rem',
//                             textTransform: 'capitalize',
//                             opacity:
//                               testcaseOption === 'testcase' ? '100%' : '40%',
//                             transition: 'opacity 0.3s',
//                           }}
//                         >
//                           <CheckBoxOutlinedIcon
//                             sx={{ fontSize: '2rem', color: '#2CBB5D' }}
//                           />
//                           <p>Testcase</p>
//                         </Button>
//                       </Stack>
//                       <p
//                         style={{
//                           color: 'white',
//                           fontSize: '2rem',
//                           padding: '1rem 0.5rem',
//                         }}
//                       >
//                         |
//                       </p>
//                       <Stack>
//                         <Button
//                           onClick={() => setTestcaseOption('testresult')}
//                           sx={{
//                             color: 'white',
//                             display: 'flex',
//                             gap: '1rem',
//                             fontSize: '1.8rem',
//                             textTransform: 'capitalize',
//                             opacity:
//                               testcaseOption != 'testcase' ? '100%' : '40%',
//                             transition: 'opacity 0.3s',
//                           }}
//                           disableRipple
//                         >
//                           <img
//                             src="assets/result.svg"
//                             alt="test result"
//                             style={{ color: '#2CBB5D' }}
//                           />
//                           <p>Test Result</p>
//                         </Button>
//                       </Stack>
//                     </Stack>
//                   </Box>
//                   <div
//                     className="wrapper"
// =======
//                       <CheckBoxOutlinedIcon
//                         sx={{ fontSize: '2rem', color: '#2CBB5D' }}
//                       />
//                       <p>Testcase</p>
//                     </Button>
//                   </Stack>
//                   <p
// >>>>>>> Stashed changes
//                     style={{
//                       color: 'white',
//                       fontSize: '2rem',
//                       padding: '1rem 0.5rem',
//                     }}
//                   >
//                     |
//                   </p>
//                   <Stack>
//                     <Button
//                       onClick={() => setTestcaseOption('testresult')}
//                       sx={{
//                         color: 'white',
//                         display: 'flex',
//                         gap: '1rem',
//                         fontSize: '1.8rem',
//                         textTransform: 'capitalize',
//                         opacity:
//                           testcaseOption != 'testcase' ? '100%' : '40%',
//                         transition: 'opacity 0.3s',
//                       }}
//                       disableRipple
//                     >
//                       <img
//                         src="assets/result.svg"
//                         alt="test result"
//                         style={{ color: '#2CBB5D' }}
//                       />
//                       <p>Test Result</p>
//                     </Button>
//                   </Stack>
//                 </Stack>
//               </Box>
//               <div
//                 className="wrapper"
//                 style={{
//                   overflowX: 'auto',
//                   maxHeight: '30rem',
//                 }}
//               >
//                 <Stack
//                   direction={'row'}
//                   gap={5}
//                   alignItems={'center'}
//                   m={5}
//                 >
//                   {testcaseOption === 'testresult' && (
//                     <p
//                       style={{
//                         minWidth: '10rem',

//                         color: accepted
//                           ? '#2CBB5D'
//                           : lastStatus === 'wrong answer'
//                             ? '#e33c37'
//                             : '#E3BD37',
//                         fontSize: '2rem',
//                         textTransform: 'capitalize',
//                         fontWeight: 'bold',
//                       }}
//                     >
//                       {accepted ? 'Accepted' : lastStatus}
//                     </p>
//                   )}
//                   {data.problem.testCases.map((cases, index) => (
//                     <p
//                       onClick={() => handleCaseClicked(cases)}
//                       onMouseEnter={() => setHoveredIndex(index)}
//                       onMouseLeave={() => setHoveredIndex(null)}
//                       style={{
//                         color:
//                           testcaseOption === 'testcase'
//                             ? 'white'
//                             : accepted && testcaseOption != 'testcase'
//                               ? '#2CBB5D'
//                               : lastStatus === 'wrong answer'
//                                 ? '#e33c37'
//                                 : '#E3BD37',
//                         fontSize: '2rem',
//                         backgroundColor:
//                           selectedCase === cases
//                             ? '#24243E'
//                             : hoveredIndex === index
//                               ? '#555570'
//                               : '',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         minWidth: '10rem',
//                         height: '5rem',
//                         borderRadius: '1rem',
//                         cursor: 'pointer',
//                         transition: 'background-color 0.3s',
//                       }}
//                       key={index}
//                     >
//                       case {index + 1}
//                     </p>
//                   ))}
//                 </Stack>
//               </div>
//               {selectedCase && (
//                 <Stack
//                   mx={8}
//                   gap={5}
//                   sx={{ color: 'white', fontSize: '1.5rem' }}
//                 >
//                   <div>
//                     <p
//                       style={{
//                         fontSize: '2rem',
//                         marginBottom: '2rem',
//                         fontWeight: '600',
//                       }}
//                     >
//                       Input =
//                     </p>
//                     <p
//                       style={{
//                         backgroundColor: '#24243E',
//                         height: '4rem',
//                         borderRadius: '1rem',
//                         display: 'flex',
//                         alignItems: 'center',
//                         padding: '2.5rem',
//                         fontSize: '2rem',
//                       }}
//                     >
//                       {selectedCase?.input}
//                     </p>
//                   </div>
//                   <div>
//                     <p
//                       style={{
//                         fontSize: '2rem',
//                         marginBottom: '2rem',
//                         fontWeight: '600',
//                       }}
//                     >
//                       Output =
//                     </p>
//                     <p
//                       style={{
//                         backgroundColor: '#24243E',
//                         height: '4rem',
//                         borderRadius: '1rem',
//                         display: 'flex',
//                         alignItems: 'center',
//                         padding: '2.5rem',
//                         fontSize: '2rem',
//                       }}
//                     >
//                       {selectedCase?.output}
//                     </p>
//                   </div>
//                 </Stack>
//               )}
//             </Box> */}
//           </Stack>
//         </Stack>
  // )
}
export default Test