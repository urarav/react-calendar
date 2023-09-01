import { memo, useState, forwardRef, useImperativeHandle } from 'react'
import './index.css'


interface CalendarProps {
    dafaultValue?: Date,
    onChange?: (data: Date) => void
}

interface CalendarRef {
    getDate: () => Date,
    setDate: (date: Date) => void
}

const InternalCalendar: React.ForwardRefRenderFunction<CalendarRef, CalendarProps> = memo((props, ref: React.Ref<CalendarRef>) => {
    const { dafaultValue = new Date(), onChange } = props
    const [date, setDate] = useState(dafaultValue)
    const [activeDateIdx, setActiveDateIdx] = useState(1)
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
    const _y = date.getFullYear(),
        _m = date.getMonth(),
        d = date.getDay(),
        _d = d ? d - 1 : 6,
        _count = new Date(_y, _m + 1, 0).getDate()

    let _prev_count = new Date(_y, _m, 0).getDate() - _d + 1

    const onClickBtn = (isNext: boolean) => () => {
        setDate(new Date(_y, isNext ? _m + 1 : _m - 1, 1))
        setActiveDateIdx(1)
    }

    const onClickCurrentMonthCell = (idx: number) => () => {
        setActiveDateIdx(idx)
        onChange && onChange(new Date(_y, _m, idx))
    }

    const onClickSideMonthCell = (idx: number, isNext: boolean) => () => {
        onClickBtn(isNext)()
        setActiveDateIdx(idx)
    }

    const renderCell = () => {
        const target = []
        for (let i = 0; i < _d; i++) {
            target.push(
                <li
                    className="prev"
                    key={`prev-${i}`}
                    onClick={onClickSideMonthCell(_prev_count, false)}
                >{_prev_count++}
                </li>
            )
        }
        for (let i = 1; i <= _count; i++) {
            target.push(
                <li
                    key={i}
                    onClick={onClickCurrentMonthCell(i)}
                    className={i === activeDateIdx ? 'is-active' : ''}
                >{i}
                </li>
            )
        }
        for (let i = _d + _count, _next_count = 1; i < 42; i++, _next_count++) {
            target.push(
                <li
                    className="next"
                    key={`next-${_next_count}`}
                    onClick={onClickSideMonthCell(_next_count, true)}
                >{_next_count}
                </li>
            )
        }
        return target
    }

    return <div className="calendar">
        <section className="calendar-header">
            <button className="calendar-header__btn" onClick={onClickBtn(false)}>&lt;</button>
            <span>{_y}年{`${date.getMonth() + 1}`}月</span>
            <button className="calendar-header__btn" onClick={onClickBtn(true)}>&gt;</button>
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
})

export const Calendar = forwardRef(InternalCalendar)