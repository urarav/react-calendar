import { memo, useState, forwardRef, useImperativeHandle, useEffect } from 'react'
import './index.css'


interface CalendarProps {
    dafaultValue?: Date,
    onChange?: (data: Date) => void
}

interface CalendarRef {
    getDate: () => Date,
    setDate: (date: Date) => void
}

const InternalCalendar: React.ForwardRefRenderFunction<CalendarRef, CalendarProps> = (props, ref) => {
    const { dafaultValue = new Date(), onChange } = props
    const [date, setDate] = useState(dafaultValue)
    const year = date.getFullYear(),
        month = date.getMonth(),
        currentDate = date.getDate(),
        firstDay = new Date(year, month, 1).getDay(),
        prevDistance = firstDay ? firstDay - 1 : 6,
        monthArea = new Date(year, month + 1, 0).getDate()
    let prevInitCount = new Date(year, month, 0).getDate() - prevDistance + 1
    const [activeDateIdx, setActiveDateIdx] = useState(currentDate)

    useEffect(() => {
        setDate(dafaultValue)
    }, [props])

    useImperativeHandle(ref, () => {
        return {
            getDate() {
                return date
            },
            setDate(date: Date) {
                setDate(date)
            }
        }
    })

    const onClickMonthBtn = (isNext: boolean) => () => {
        setDate(new Date(year, isNext ? month + 1 : month - 1, 1))
    }

    const onClickYearBtn = (isNext: boolean) => () => {
        setDate(new Date(isNext ? year + 1 : year - 1, month, 1))
    }

    const onClickCurrentMonthCell = (idx: number) => () => {
        setActiveDateIdx(idx)
        onChange && onChange(new Date(year, month, idx))
    }

    const onClickSideMonthCell = (idx: number, isNext: boolean) => () => {
        onClickMonthBtn(isNext)()
        setActiveDateIdx(idx)
    }

    const renderCell = () => {
        const target = []
        for (let i = 0; i < prevDistance; i++) {
            target.push(
                <li
                    className="prev"
                    key={`prev-${i}`}
                    onClick={onClickSideMonthCell(prevInitCount, false)}
                >{prevInitCount++}
                </li>
            )
        }
        for (let i = 1; i <= monthArea; i++) {
            target.push(
                <li
                    key={i}
                    onClick={onClickCurrentMonthCell(i)}
                    className={i === activeDateIdx ? 'is-active' : ''}
                >{i}
                </li>
            )
        }
        for (let i = prevDistance + monthArea, nextInitCount = 1; i < 42; i++, nextInitCount++) {
            target.push(
                <li
                    className="next"
                    key={`next-${nextInitCount}`}
                    onClick={onClickSideMonthCell(nextInitCount, true)}
                >{nextInitCount}
                </li>
            )
        }
        return target
    }

    return <div className="calendar">
        <section className="calendar-header">
            <section>
                <button className="calendar-header__btn" onClick={onClickYearBtn(false)}>&lt;&lt;</button>&nbsp;
                <button className="calendar-header__btn" onClick={onClickMonthBtn(false)}>&lt;</button>
            </section>
            <span>{year}年{`${month + 1}`}月</span>
            <section>
                <button className="calendar-header__btn" onClick={onClickMonthBtn(true)}>&gt;</button>&nbsp;
                <button className="calendar-header__btn" onClick={onClickYearBtn(true)}>&gt;&gt;</button>
            </section>
        </section>
        <section className="calendar-content">
            <ul className="calendar-content__list">
                <li className="is-day">一</li>
                <li className="is-day">二</li>
                <li className="is-day">三</li>
                <li className="is-day">四</li>
                <li className="is-day">五</li>
                <li className="is-day">六</li>
                <li className="is-day">日</li>

                {renderCell()}
            </ul>
        </section>
    </div>
}

export const Calendar = memo(forwardRef(InternalCalendar))