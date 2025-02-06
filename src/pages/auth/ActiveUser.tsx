
import type React from "react"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Typography, Box, Container, Paper } from "@mui/material"
import { styled } from "@mui/system"

const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
  },
}))

const ActiveCodeUser: React.FC = () => {
  const { activeCode } = useParams()
  const [enable, setEnable] = useState(false)
  const [notification, setNotification] = useState("")

  useEffect(() => {
    if (activeCode) {
      handleActiveCode()
    }
  }, [activeCode]) // Added activeCode to dependencies

  const handleActiveCode = async () => {
    console.log("MaKichHoat:", activeCode)
    try {
      const endpoint = `http://localhost:8080/auth/active-account?code=${activeCode}`
      const response = await fetch(endpoint, { method: "GET" })
      const data = await response.json()

      if (data.success) {
        setEnable(true)
      } else {
        setNotification(data.text || "Activation failed")
      }
    } catch (error) {
      console.log(error)
      setNotification("An error occurred during activation")
    }
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          KÍCH HOẠT TÀI KHOẢN
        </Typography>
        <Box mt={2}>
          {enable ? (
            <Typography align="center">
              Tài khoản kích hoạt thành công. Vui lòng <StyledLink to="/auth/login">Đăng nhập</StyledLink>
            </Typography>
          ) : (
            <Typography color="error">Tài khoản kích hoạt thất bại. Lỗi: {notification}</Typography>
          )}
        </Box>
      </Paper>
    </Container>
  )
}

export default ActiveCodeUser

