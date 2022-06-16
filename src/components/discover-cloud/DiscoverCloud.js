import React, { useState } from "react"
import { Text, Flex, NavigationTabs } from "@netdata/netdata-ui"

import CloudTab from "./cloudTab"
import DiscoverCloudModal from "./discoverCloudModal"

import { callAll } from "@/src/utils/utils"
import { TabsContent } from "./contants"

const Wrapper = Flex
const InnerPostioner = Flex

const DiscoverCloud = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [seletedModalContent, setSelectedModalContent] = useState(null)

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
      <InnerPostioner
        padding={[4, 2, 4, 2]}
        gap={4}
        height="100%"
        justifyContent="center"
        alignItems="center"
      >
        <Text color="primary">Discover cloud functionalities:</Text>
        <Flex>
          <NavigationTabs>
            {Object.keys(TabsContent).map((key, index) => {
              const { label, icon, id } = TabsContent[key]
              const slectedContentId = seletedModalContent ? seletedModalContent.id : null
              return (
                <CloudTab
                  key={key}
                  icon={icon}
                  active={id === slectedContentId}
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
      </InnerPostioner>
      {isModalOpen && seletedModalContent && (
        <DiscoverCloudModal
          {...seletedModalContent}
          closeModal={callAll(handleCloseModal, handleResetModalContent)}
          handleGoToCloud={handleGoToCloud}
        />
      )}
    </Wrapper>
  )
}

export default DiscoverCloud
