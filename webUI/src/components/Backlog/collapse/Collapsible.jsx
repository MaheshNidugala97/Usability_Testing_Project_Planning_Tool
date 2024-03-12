import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronDown } from '@fortawesome/free-solid-svg-icons'
import { alpha } from '@mui/material/styles';
import { Toolbar, Typography, Tooltip, IconButton } from '@mui/material';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { DatePicker } from '../Table/DatePicker';
import SimplePopup from '../Table/DatePicker';

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
          <div style={{ display: 'flex', padding: "2px 20px 2px 20px", marginTop: '-30px', justifyContent: 'space-between' }}>

            <div className={titleClassName}>{header}
              {header === 'Selected for Development' ?  (<span><button
                type="button"
                aria-describedby={popupId}
                style={{
                  background: 'transparent', height: '28px',
                  border: '1px solid black',
                  textAlign: 'center',
                  width: '96px',
                  padding: '0px! important',
                  fontSize: '14px', marginLeft: '13px', borderRadius: '30px'
               
                }} onClick={handleClick}>Edit Date</button>
                <SimplePopup anchor={anchor} setAnchor={setAnchor}/></span>) : null }</div>

            {numSelected > 0 ? (
              <Tooltip title="Delete">
                <IconButton onClick={onDelete}>
                  <FontAwesomeIcon icon={faTrashCan} size='xs' /></IconButton>
              </Tooltip>
            ) : false}
          </div>

        </div>
        <div style={{ height, overflow: "hidden", transition: "height 0.2s ease-in-out", marginTop: "-19px" }}>
          <div ref={ref}>
            <div className={contentContainerClassName}>{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Collapsible;

