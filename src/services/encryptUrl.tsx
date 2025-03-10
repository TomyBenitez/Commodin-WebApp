// encryptedUrlService.ts

import { getCookie } from "./tokenChrome";

// Función del servicio para generar la URL encriptada
export const EncryptedUrl = async (actId: string, dataTypeAct: string): Promise<string | null> => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  // Obtener las cookies necesarias
  const empresaId = await getCookie('empresaId');
  const secUserId = await getCookie('secUserId');

  // Validar que todos los valores estén disponibles
  if (!empresaId || !secUserId || !actId || !dataTypeAct) return null;

  // Generar los parámetros para la URL encriptada
  let ParmEncripter = `${actId.toString().trim()},${empresaId.toString().trim()},${dataTypeAct.toString().trim()},${secUserId.toString().trim()}`;
  let Parm = btoa(ParmEncripter.trim());
  
  // Reemplazar los caracteres especiales en la cadena base64
  Parm = Parm.replace(/\+/g, '%2B')
             .replace(/=/g, '%3D')
             .replace(/ /g, '%20')
             .replace(/\//g, '%2F');

  // Construir la URL final
  const CompartirLogin = `${API_BASE_URL}/GoToLinkShare.aspx?${Parm.trim()}`;
  return CompartirLogin;
};