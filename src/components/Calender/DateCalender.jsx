import React, { useState, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import { Badge } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import VerifiedIcon from '@mui/icons-material/Verified';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { color } from '@mui/system';

const initialValue = dayjs(new Date().toISOString().split('T')[0]);

function ServerDay(props) {
    const { highlightedDays = [], day, outsideCurrentMonth, startDate, ...other } = props;
    const specificDate = day;
    const specificDateString = specificDate.toISOString().split('T')[0];

    const isSelected =
        !outsideCurrentMonth && highlightedDays.some((date) => date.startsWith(specificDateString));

    const isBeforeCurrentDate = specificDate.isBefore(dayjs(), 'day');
    const isAfterStartDate =
        specificDate.isSame(startDate, 'day') || specificDate.isAfter(startDate, 'day');

    const isNotCompleted =
        isAfterStartDate &&
        isBeforeCurrentDate &&
        !isSelected &&
        !highlightedDays.includes(specificDateString);

    const badgeContent = isSelected ? <VerifiedIcon /> : isNotCompleted ? <DoDisturbIcon /> : null;

    return (
        <Badge key={day.toISOString()} overlap="circular" badgeContent={badgeContent}>
            <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
        </Badge>
    );
}

export default function DateCalendarServerRequest({ progress, challenge }) {
    const [isLoading, setIsLoading] = useState(false);
    const [startDate, setStartDate] = useState(dayjs(challenge.startDate));
    const [endDate, setEndDate] = useState(dayjs(challenge.endDate));

    const currentDate = new Date();
    const currentDateLocalISOString = new Date(
        currentDate.getTime() + currentDate.getTimezoneOffset() * 60000
    ).toISOString();

    let dataFromServer = progress.data.filter((val) => val.completed === true);

    const [highlightedDays, setHighlitedDays] = useState([]);
    useEffect(() => {
        const filteredData = dataFromServer
            .filter(
                (item) =>
                    dayjs(item.date).isSame(startDate, 'day') ||
                    dayjs(item.date).isAfter(startDate, 'day')
            )
            .filter(
                (item) =>
                    dayjs(item.date).isSame(endDate, 'day') ||
                    dayjs(item.date).isBefore(endDate, 'day')
            )
            .filter((item) => dayjs(item.date).isBefore(currentDateLocalISOString, 'day'))
            .map((item) => dayjs(item.date).toISOString());
        // console.log('memo', dataFromServer);
        // console.log(progress);
        setHighlitedDays(filteredData);
    }, [startDate, endDate, progress, challenge]);

    const handleMonthChange = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
                sx={{
                    width: 300,
                    color: 'success.main',
                }}
                defaultValue={initialValue}
                loading={isLoading}
                onMonthChange={handleMonthChange}
                renderLoading={() => <DayCalendarSkeleton />}
                slots={{
                    day: (props) => (
                        <ServerDay
                            {...props}
                            // startDate={startDate}
                            startdate={startDate}
                            enddate={endDate} /* endDate={endDate}*/
                        />
                    ),
                }}
                slotProps={{
                    day: {
                        highlightedDays,
                    },
                }}
            />
        </LocalizationProvider>
    );
}

const style = {
    color: 'white',
    background: 'black',
};
