import React, { useMemo } from 'react'
import dayjs from 'dayjs'
import { useEditorContext } from '@/features/visual-editor/provider'

const OperationHistoryPane: React.FC = () => {
  const [{ snapshots, snapshotIndex }, { changeSnapShot }] = useEditorContext()
  const reverseSnapshots = useMemo(
    () => snapshots.slice().reverse(),
    [snapshots]
  )
  const reverseSnapshotIndex = useMemo(
    () => snapshots.length - snapshotIndex - 1,
    [snapshotIndex, snapshots.length]
  )

  return (
    <div className="operation-history-pane">
      {reverseSnapshots.map((snapshot, index) => {
        return (
          <div
            key={snapshot.timestamp}
            className={`operation-history-item ${
              reverseSnapshotIndex === index ? 'active' : ''
            }`}
            onClick={() => {
              if (reverseSnapshotIndex !== index) {
                changeSnapShot(snapshots.length - index - 1)
              }
            }}
          >
            <span>{snapshot.desc}</span>
            <span className="text-xs flex-shrink-0">
              {dayjs(snapshot.timestamp).format('YYYY/M/D HH:mm:ss')}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default OperationHistoryPane
