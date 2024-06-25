import { Button, Typography } from "@mui/material"
import TeamsList from "../../components/HomePage/TeamsList"
import CreateTeamCard from "../../components/CreateTeamCard"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { getUserTeams } from "../../store/actions/userInfo";
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';

interface Team {
  doc_id: string;
  slogan: string;
  team_name: string;
  emails: string[];
  exp: number;
  level: number;
  rank_points: number;
  rank_tier: number;
  registration_date: {
    _seconds: number;
    _nanoseconds: number;
  };
  mmr: number;
}

const Teams = () => {
  const [showTeamCard, setShowTeamCard] = useState(false);
  const [openTeam, setOpenTeam] = useState(-1);
  const [userTeams, setUserTeams] = useState<Team[]>([]);

  const handleShowTeamCard = () => {
    setShowTeamCard(true);
  };

  const handleTeamToggle = (index: number) => {
    setOpenTeam(openTeam === index ? -1 : index);
  };

  const handleAddTeam = (newTeam: Team) => {
    setUserTeams(prevTeams => [...prevTeams, newTeam]);
  };

  const handleCloseshowTeamCard = () => {
    setShowTeamCard(false);
  };

  const authState = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  
  useEffect(() => {
    const jwtToken = authState.user.token;
    dispatch<any>(getUserTeams({ jwtToken }))
      .unwrap()
      .then((responseData: any) => {
        setUserTeams(responseData);
      })
      .catch((error: any) => {
        console.error('Failed to fetch user teams:', error);
      });
  }, [authState.user.token, dispatch]);

  return (
    <div style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '3rem',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '3rem 6rem',
      }}>
        <Typography
          variant="h2"
          sx={{
            color: 'white',
            fontWeight: '500',
          }}
        >
          My Teams
        </Typography>

        <Button
          variant="contained"
          size="large"
          sx={{
            fontSize: '1.5rem',
            textTransform: 'capitalize',
            backgroundColor: '#3f51b5',
            color: 'white',
            borderRadius: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
    
            '&:hover': {
              backgroundColor: '#303f9f',
            },
          }}
          onClick={handleShowTeamCard}
          disableRipple
          disableElevation
        >
          <GroupAddOutlinedIcon sx={{
            fontSize: '2.5rem',
          }} />
          Create Team
        </Button>
        
      </div>
      <div
        style={{
          // backgroundColor: '#0f0c29',
          // width: '40rem',
          // height: '35rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          // overflowY: 'auto',
          // scrollbarWidth: 'none',
          // gap: '4rem',
          // padding: '3rem 0',
        }}
      >
        {userTeams.length > 0 ? (
          userTeams.map((team, index) => (
            <TeamsList
              key={team.doc_id}
              open={openTeam === index}
              onClick={() => handleTeamToggle(index)}
              team={team}
            />
          ))
        ) : (
          <Typography variant="h2" sx={{ 
            color: 'white',
          }}>
            No teams found
          </Typography>
        )}
      </div>
      {showTeamCard && (
        <CreateTeamCard
          open={true}
          onClose={handleCloseshowTeamCard}
          onTeamCreated={handleAddTeam}
        />
      )}
    </div>
  )
}
export default Teams