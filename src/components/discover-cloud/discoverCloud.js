import React, { useState, useRef } from "react"
import { Text, Flex, NavigationTabs } from "@netdata/netdata-ui"

import CloudTab from "./cloudTab"
import { TITLE } from "./discoverCloudModal"

import { callAll } from "@/src/utils/utils"
import { TabsContent } from "./contents"

import DiscoverCloudDrop from "./discoverCloudDrop"

const Wrapper = Flex
const InnerPositioner = Flex

const DiscoverCloud = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedModalContent, setSelectedModalContent] = useState(null)
  const dropDownParentRef = useRef()

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleGoToCloud = ({ link }) => {
    window.location.href = link
  }

  const handleSetModalContent = content => {
    setSelectedModalContent(content)
  }
  const handleResetModalContent = () => {
    setSelectedModalContent(null)
  }

  return (
    <Wrapper padding={[0, 0, 0, 4]} position="relative" height={15}>
      <InnerPositioner
        padding={[4, 2, 4, 2]}
        gap={4}
        height="100%"
        justifyContent="center"
        alignItems="center"
      >
        <Text color="primary">{TITLE}:</Text>
        <Flex ref={dropDownParentRef}>
          <NavigationTabs>
            {Object.keys(TabsContent).map((key, index) => {
              const { label, icon, id } = TabsContent[key]
              const selectedContentId = selectedModalContent ? selectedModalContent.id : null
              return (
                <CloudTab
                  key={key}
                  icon={icon}
                  active={id === selectedContentId}
                  label={label}
                  showBorderLeft={index === 0}
                  onActivate={callAll(handleOpenModal, () =>
                    handleSetModalContent(TabsContent[key])
                  )}
                />
              )
            })}
          </NavigationTabs>
        </Flex>
      </InnerPositioner>
      <DiscoverCloudDrop
        parentRef={dropDownParentRef}
        isDropdownOpen={isModalOpen}
        {...selectedModalContent}
        closeDropdown={callAll(handleCloseModal, handleResetModalContent)}
        handleGoToCloud={handleGoToCloud}
      />
      {/* {isModalOpen && selectedModalContent && (
        <DiscoverCloudModal
          {...selectedModalContent}
          closeModal={callAll(handleCloseModal, handleResetModalContent)}
          handleGoToCloud={handleGoToCloud}
        />
      )} */}
    </Wrapper>
  )
}

export default DiscoverCloud
