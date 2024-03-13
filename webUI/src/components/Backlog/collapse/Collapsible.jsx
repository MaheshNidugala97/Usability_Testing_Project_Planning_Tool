import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronDown } from '@fortawesome/free-solid-svg-icons'
import { alpha } from '@mui/material/styles';
import { Toolbar, Typography, Tooltip, IconButton } from '@mui/material';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import AddDate from './AddDate';
import axios from "axios";
import { grey } from "@mui/material/colors";

const Collapsible = ({
  numSelected,
  open,
  onDelete,
  collapsibleClassName = "collapsible-card-edonec",
  headerClassName = "collapsible-header-edonec",
  titleClassName = "title-text-edonec",
  iconButtonClassName = "collapsible-icon-button-edonec",
  contentClassName = "collapsible-content-edonec",
  contentContainerClassName = "collapsible-content-padding-edonec",
  children,
  header
}) => {
  const [isOpen, setIsOpen] = useState(open);
  const [height, setHeight] = useState(open ? undefined : 0);
  const ref = useRef(null);
  const [anchor, setAnchor] = React.useState(null);
  const [isAddMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [sprintName, setSprintName] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [formatStartDate, setFormatStartDate] = useState();
  const [formatEndDate, setFormatEndDate] = useState();

  const handleFilterOpening = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClick = (event) => {
    setAnchor(anchor ? null : event.currentTarget);
  };
  const popupOpen = Boolean(anchor);
  const popupId = popupOpen ? 'simple-popup' : undefined;

  useEffect(() => {
    if (!height || !isOpen || !ref.current) return;

    const resizeObserver = new ResizeObserver((el) => {
      setHeight(el[0].contentRect.height);
    });
    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [height, isOpen]);

  useEffect(() => {
    if (isOpen) setHeight(ref.current?.getBoundingClientRect().height);
    else setHeight(0);
  }, [isOpen]);


  useEffect(() => {
    const fetchSprint = async () => {
      try {
        const response = await axios.get("http://localhost:3009/api/sprints");
        if (response.data) {
          const sprint = response.data[0];
          setSprintName(sprint.sprintName);
          setStartDate(new Date(sprint.startDate));
          setEndDate(new Date(sprint.endDate));
          setFormatStartDate(new Date(sprint.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
          setFormatEndDate(new Date(sprint.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        }
      } catch (error) {
        console.error("Error fetching sprint details:", error);
      }
    };
    fetchSprint();
  }, []);



const handleDateChange = (newStartDate, newEndDate) => {
  setFormatStartDate(newStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  setFormatEndDate(newEndDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  };


  return (
    <>
      <div style={{ borderRadius: '10px' }}>
        <div>
          <button
            type="button"
            className={iconButtonClassName}
            onClick={handleFilterOpening}
          >
            <FontAwesomeIcon icon={faCircleChevronDown} className={`fas-edonec fa-chevron-down-edonec ${isOpen
              ? "rotate-center-edonec down"
              : "rotate-center-edonec up"
              }`} />

          </button>
          <div style={{ display: 'flex', padding: "2px 20px 2px 20px", marginTop: '-35px', justifyContent: 'space-between' }}>

            <div className={titleClassName} style={{fontSize:'25px'}}>{header}
              {header === 'Selected for Development' ?  (<span><button
                type="button"
                aria-describedby={popupId}
                style={{
                  background: 'transparent', height: '28px',
                  border:formatStartDate ? 'none' : '1px solid black',
                  color: formatStartDate ?  'grey' : null,
                  fontWeight: formatStartDate ? 'bold' : 'normal',
                  textAlign: 'center',
                  width: startDate ? '130px':'96px',
                  padding: '0px! important',
                  fontSize: formatStartDate ? '14px' :'14px',
                  marginLeft: '13px',
                  borderRadius: '30px'
                }}  onClick={() => setAddMemberModalOpen(true)}>{formatStartDate && formatEndDate ? `${formatStartDate} - ${formatEndDate}` : 'Edit Date'}</button>
                </span>) : null }</div>

            {numSelected > 0 ? (
              <Tooltip title="Delete">
                <IconButton onClick={onDelete}>
                  <FontAwesomeIcon icon={faTrashCan} size='xs' color='red'  /></IconButton>
              </Tooltip>
            ) : false}
          </div>

        </div>
        <div style={{ height, overflow: "hidden", transition: "height 0.2s ease-in-out", marginTop: "-19px" }}>
          <div ref={ref}>
            <div className={contentContainerClassName}>{children}</div>
          </div>
        </div>
        <AddDate
        open={isAddMemberModalOpen}
        onClose={() => setAddMemberModalOpen(false)}
        onDateChange={handleDateChange}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        sprintName={sprintName}
        setSprintName={setSprintName}
      />
      </div>
    </>
  );
};

export default Collapsible;

