import React from "react"
import { RoomLabel } from "./room-label"
import { roomsMock } from "../../mocks"
import {
  RoomListContainer, RoomAddSection, StyledAnnotation, PlusButton,
} from "./styled"

const mockedWorkspace = {}

export const SpaceRooms = () => {
  const workspace = mockedWorkspace as any
  const rooms = roomsMock as any
  const userIsAdmin = true
  const isAllowedToCreateRooms = !workspace.createRoomAdminsOnly || userIsAdmin

  const handleAddRoom = (e: React.SyntheticEvent<HTMLButtonElement, Event>) => {
    e.preventDefault()
    // navigate to room creation?, which is not a route in Cloud SPA (TODO make it so)
  }

  return (
    <>
      {isAllowedToCreateRooms && (
        <RoomAddSection>
          <StyledAnnotation>Rooms</StyledAnnotation>
          <PlusButton icon="plus" onClick={handleAddRoom} />
        </RoomAddSection>
      )}
      <RoomListContainer>
        {rooms.map((room: any) => (
          <RoomLabel key={room.id} room={room} />
        ))}
      </RoomListContainer>
    </>
  )
}
